# back-sst

Backend serverless API usando SST, AWS Lambda, API Gateway, TypeORM y PostgreSQL.

## Características
- Despliegue serverless con SST (Serverless Stack)
- API REST para productos y usuarios
- Integración con PostgreSQL usando TypeORM
- Inyección de dependencias con tsyringe
- Validación de entrada con Zod
- Autenticación JWT
- Logging y manejo de errores

## Requisitos
- Node.js o Bun
- Cuenta de AWS y credenciales configuradas (`aws configure`)
- Base de datos PostgreSQL (local o gestionada)

## Variables de entorno
Crea un archivo `.env` en la raíz con las siguientes variables:

## Instalación de dependencias

```bash
bun install
```

## Desarollo Local

```bash
bun sst dev
```

## Estructura del proyecto
```
├── api        # Handlers Lambda para cada endpoint
├── core       # Entidades, repositorios y contratos
├── interfaces # Interfaces de servicios
├── schemas    # Validacion con Zod
├── services   # Lógica de negocio
├── utils      # Utilidades, logging, inyección, etc.
```

## Recursos

- [SST Documentation](https://docs.sst.dev/)
- [AWS Lambda](https://docs.aws.amazon.com/lambda/)
- [TypeORM](https://typeorm.io/)
- [Bun](https://bun.sh/)
- [tsyringe](https://github.com/microsoft/tsyringe)
- [Zod](https://zod.dev/)