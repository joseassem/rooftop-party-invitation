import { NextRequest, NextResponse } from 'next/server'
import { validateAdminAuth, getUnauthorizedResponse } from '@/lib/auth'

/**
 * GET /api/admin/validate
 * Validates admin credentials
 */
export async function GET(request: NextRequest) {
    if (!validateAdminAuth(request)) {
        return getUnauthorizedResponse()
    }

    return NextResponse.json({
        success: true,
        message: 'Autenticación válida'
    })
}
