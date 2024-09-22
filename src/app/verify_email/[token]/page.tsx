import { verifyEmail } from '@/app/actions/auth'

interface Props {
  params: {
    token: string
  }
}

export default async function Page(
  props: Props
): Promise<React.ReactElement | null> {
  const token_hash = props.params.token
  if (props.params.token) {
    const errorMessage = await verifyEmail(token_hash)

    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-center">
          {errorMessage ??
            'Your email has been successfully verified. You can now log in to your account.'}
        </h1>
      </div>
    )
  }

  return null
}
