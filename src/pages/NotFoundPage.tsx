const NotFoundPage = () => (
  <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
    <div className="text-center max-w-md">
      <p className="text-[#2563EB] font-bold text-[14px] uppercase tracking-widest mb-4">404</p>
      <h1 className="text-[#0F172A] font-bold text-[36px] mb-4 leading-tight">Page Not Found</h1>
      <p className="text-[#475569] text-[16px] mb-8 leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="/"
         className="bg-[#2563EB] text-white text-[14px] font-semibold px-6 py-3 rounded-full
                    hover:bg-[#1D4ED8] transition-colors inline-block">
        Back to Home
      </a>
    </div>
  </div>
);

export default NotFoundPage;
