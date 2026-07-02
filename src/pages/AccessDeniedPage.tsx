const AccessDeniedPage = () => (
  <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
    <div className="text-center max-w-md">
      <p className="text-[#2563EB] font-bold text-[14px] uppercase tracking-widest mb-4">403</p>
      <h1 className="text-[#0F172A] font-bold text-[36px] mb-4 leading-tight">Access Denied</h1>
      <p className="text-[#475569] text-[16px] mb-8 leading-relaxed">
        You don't have the required permissions to access this page.
        If you think this is a mistake, contact your institution administrator.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href="/dashboard"
           className="bg-[#2563EB] text-white text-[14px] font-semibold px-6 py-3 rounded-full
                      hover:bg-[#1D4ED8] transition-colors">
          Go to Dashboard
        </a>
        <a href="/auth"
           className="border border-[#CBD5E1] text-[#475569] text-[14px] font-semibold px-6 py-3 rounded-full
                      hover:bg-[#F1F5F9] transition-colors">
          Sign in with another account
        </a>
      </div>
    </div>
  </div>
);

export default AccessDeniedPage;
