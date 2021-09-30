import { enforceSuperAdminIfNotCurrentOrganization, setDefaultOrganizationId } from "app/core/utils"
import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetProjectsInput
  extends Pick<Prisma.ProjectFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

interface GetProjectsInputWithOrgId extends GetProjectsInput {
  organizationId: number
}

export default resolver.pipe(
  resolver.authorize(),
  // Set input.organizationId to the current organization if one is not set
  // This allows SUPERADMINs to pass in a specific organizationId
  setDefaultOrganizationId,
  // But now we need to enforce input.organizationId matches
  // session.orgId unless user is a SUPERADMIN
  enforceSuperAdminIfNotCurrentOrganization,

  async ({ organizationId, where, orderBy, skip = 0, take = 100 }: GetProjectsInputWithOrgId) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: projects,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.project.count({ where: { organizationId, ...where } }),
      query: (paginateArgs) =>
        db.project.findMany({ ...paginateArgs, where: { organizationId, ...where }, orderBy }),
    })

    return {
      projects,
      nextPage,
      hasMore,
      count,
    }
  }
)
