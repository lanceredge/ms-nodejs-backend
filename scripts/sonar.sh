#!/bin/bash

# Obtener la Subnet ID predeterminada
SUBNET_ID=$(aws ec2 describe-subnets \
  --filters "Name=default-for-az,Values=true" \
  --query 'Subnets[0].SubnetId' \
  --output text)

# Verificar si el Security Group "segr-sonar-ec2" existe
SG_ID=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=segr-sonar-ec2" \
  --query 'SecurityGroups[0].GroupId' \
  --output text)

# Si no existe, crear el Security Group
if [ "$SG_ID" == "None" ]; then
  VPC_ID=$(aws ec2 describe-vpcs \
    --filters "Name=isDefault,Values=true" \
    --query 'Vpcs[0].VpcId' \
    --output text)

  SG_ID=$(aws ec2 create-security-group \
    --group-name segr-sonar-ec2 \
    --description "Security Group para SonarQube EC2" \
    --vpc-id $VPC_ID \
    --query 'GroupId' \
    --output text)

  # Autorizar acceso SSH (puerto 22) y HTTP (puerto 9000)
  aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 22 --cidr 0.0.0.0/0
  aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 9000 --cidr 0.0.0.0/0
fi

# Crear archivo de User Data para instalar SonarQube (con expansión de variables habilitada)
cat <<EOF > user-data.sh
#!/bin/bash
exec > >(tee /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1
set -euxo pipefail

yum update -y

# Instalar Java 17
amazon-linux-extras enable corretto17
yum install -y java-17-amazon-corretto-devel wget unzip

# Configurar JAVA_HOME globalmente
echo "export JAVA_HOME=/usr/lib/jvm/java-17-amazon-corretto" > /etc/profile.d/java.sh
echo "export PATH=\$JAVA_HOME/bin:\$PATH" >> /etc/profile.d/java.sh
chmod +x /etc/profile.d/java.sh
source /etc/profile.d/java.sh

# Crear usuario sonar
useradd -m -d /opt/sonarqube -s /bin/bash sonar

cd /opt
wget https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-10.4.1.88267.zip
unzip sonarqube-*.zip

# Detectar automáticamente la carpeta SonarQube
SONAR_DIR=\$(find /opt -maxdepth 1 -type d -name "sonarqube-*")
ln -sfn "\$SONAR_DIR" /opt/sonarqube

chown -R sonar:sonar "\$SONAR_DIR"
chmod +x "\$SONAR_DIR/bin/linux-x86-64/sonar.sh"

# Crear servicio systemd con Type=forking
cat > /etc/systemd/system/sonarqube.service <<EOT
[Unit]
Description=SonarQube service
After=network.target

[Service]
Type=forking
User=sonar
Group=sonar
Environment=JAVA_HOME=/usr/lib/jvm/java-17-amazon-corretto
ExecStart=\$SONAR_DIR/bin/linux-x86-64/sonar.sh start
ExecStop=\$SONAR_DIR/bin/linux-x86-64/sonar.sh stop
Restart=always
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOT

systemctl daemon-reexec
systemctl daemon-reload
systemctl enable sonarqube
systemctl start sonarqube
EOF

# Lanzar la instancia EC2 con el user-data generado
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --instance-type t2.medium \
#   --key-name sonarqube-key \
  --security-group-ids $SG_ID \
  --subnet-id $SUBNET_ID \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=SonarQube2}]' \
  --user-data file://user-data.sh

  