export default function SignupCompletePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
      <h1 className="text-3xl font-bold mb-4">회원가입이 완료되었습니다!</h1>
      <p className="mb-8 text-lg text-muted-foreground">제니스월드에 오신 것을 환영합니다.</p>
      <a href="/login" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-8 py-3 text-base font-medium">
        로그인 하러 가기
      </a>
    </div>
  )
} 