#!/bin/sh

# Nombre del repositorio ECR
REPO_NAME="devops-registry"
# Región AWS
REGION="us-east-1"

echo "Verificando si el repositorio $REPO_NAME existe en la región $REGION..."

# Comprobar si el repositorio ya existe
aws ecr describe-repositories \
    --repository-names "$REPO_NAME" \
    --region "$REGION" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "El repositorio $REPO_NAME ya existe en ECR."
else
    echo "El repositorio no existe. Creando $REPO_NAME..."

    aws ecr create-repository \
        --repository-name "$REPO_NAME" \
        --region "$REGION" \
        --image-scanning-configuration scanOnPush=true \
        --image-tag-mutability MUTABLE

    if [ $? -eq 0 ]; then
        echo "Repositorio ECR creado exitosamente."
    fi
fi