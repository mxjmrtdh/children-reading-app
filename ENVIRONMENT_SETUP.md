# Configuración de Variables de Entorno

## Variables Requeridas

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Supabase Configuration
# Obtén estos valores desde tu dashboard de Supabase: https://supabase.com/dashboard/project/[tu-proyecto]/settings/api

NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui

# MCP Server Configuration (opcional, para herramientas de desarrollo)
SUPABASE_ACCESS_TOKEN=tu_access_token_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

## Cómo obtener las claves de Supabase:

1. Ve a tu dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a Settings → API
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (para MCP)

## Para MCP (opcional):

1. Ve a Settings → Access Tokens
2. Crea un nuevo token de acceso personal
3. Usa ese token como `SUPABASE_ACCESS_TOKEN`

## Seguridad:

- **NUNCA** subas el archivo `.env.local` al repositorio
- Las claves `NEXT_PUBLIC_*` son seguras para el frontend
- Las claves `SUPABASE_SERVICE_ROLE_KEY` y `SUPABASE_ACCESS_TOKEN` son sensibles
