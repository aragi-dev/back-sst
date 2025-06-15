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
- Bun
- Cuenta de AWS y credenciales configuradas (`aws configure`)
- Base de datos PostgreSQL (local o gestionada)

## Configuración de secretos y variables de entorno

Las variables sensibles como la URL de la base de datos se gestionan usando los secretos de SST. No es necesario un archivo `.env`.

Para establecer la URL de la base de datos utiliza:

```bash
bun sst secret set NEON_DATABASE_URL "postgresql://usuario:contraseña@host:puerto/db?sslmode=require"
```

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
├── core/
│   └── docProcessor/
│       ├── entities/           # Entidades de dominio (ej: User)
│       ├── interfaces/         # Contratos de repositorios
│       └── repositories/       # Implementaciones de repositorios
├── docProcessor/
│   ├── api/
│   │   ├── sendEmail/          # Endpoint para envío de emails
│   │   ├── userCreate/         # Endpoint para creación de usuario
│   │   └── userLogin/          # Endpoint para login de usuario
│   ├── interfaces/             # DTOs para servicios
│   └── services/               # Lógica de negocio (casos de uso)
├── utils/
│   ├── adapters/               # Adaptadores y utilidades
│   ├── dbBase/                 # Base de datos y entidades
│   ├── enums/                  # Enumeraciones
│   ├── loggers/                # Logging y decoradores
│   └── ...otros utilitarios
├── sst.config.ts               # Configuración de SST
├── tsconfig.json               # Configuración de TypeScript
├── package.json                # Dependencias y scripts
└── README.md                   # Documentación
```

## Principales módulos y responsabilidades

- **core/docProcessor/entities/**: Entidades de dominio (ejemplo: `User.ts`).
- **core/docProcessor/repositories/**: Implementaciones de repositorios para acceso a datos.
- **docProcessor/api/**: Handlers Lambda para endpoints REST (`sendEmail`, `userCreate`, `userLogin`).
- **docProcessor/services/**: Casos de uso y lógica de negocio.
- **utils/**: Utilidades generales, adaptadores, enums, logging, decoradores, etc.

## Ejemplo de endpoints

- `POST /userCreate` — Crear usuario
- `POST /userLogin` — Login de usuario
- `POST /sendEmail` — Enviar email (MFA, notificaciones, etc.)

## Recursos

- [SST Documentation](https://docs.sst.dev/)
- [AWS Lambda](https://docs.aws.amazon.com/lambda/)
- [TypeORM](https://typeorm.io/)
- [Bun](https://bun.sh/)
- [tsyringe](https://github.com/microsoft/tsyringe)
- [Zod](https://zod.dev/)