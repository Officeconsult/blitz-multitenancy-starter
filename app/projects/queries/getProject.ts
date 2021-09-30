import { enforceSuperAdminIfNotCurrentOrganization, setDefaultOrganizationId } from "app/core/utils"
import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetProject = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
  organizationId: z.number().optional(),
})

export default resolver.pipe(
  resolver.zod(GetProject),
  resolver.authorize(),
  // Set input.organizationId to the current organization if one is not set
  // This allows SUPERADMINs to pass in a specific organizationId
  setDefaultOrganizationId,
  // But now we need to enforce input.organizationId matches
  // session.orgId unless user is a SUPERADMIN
  enforceSuperAdminIfNotCurrentOrganization,

  async ({ id, organizationId }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const project = await db.project.findFirst({ where: { id, organizationId } })

    if (!project) throw new NotFoundError()

    return project
  }
)
