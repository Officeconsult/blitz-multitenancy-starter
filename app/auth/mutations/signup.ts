import { resolver, SecurePassword } from "blitz"
import db from "db"
import { Signup } from "app/auth/validations"
import { Role } from "types"

export default resolver.pipe(resolver.zod(Signup), async ({ email, password }, ctx) => {
  const hashedPassword = await SecurePassword.hash(password.trim())
  const user = await db.user.create({
    data: {
      email: email.toLowerCase().trim(),
      hashedPassword,
      role: "CUSTOMER",
      memberships: {
        create: {
          role: "OWNER",
          organization: {
            create: {
              name: `${email}'s organization`,
            },
          },
        },
      },
    },
    select: { id: true, name: true, email: true, role: true, memberships: true },
  })

  await ctx.session.$create({
    userId: user.id,
    roles: [user.role, user.memberships[0].role as Role],
    orgId: user.memberships[0].organizationId,
  })

  return user
})
