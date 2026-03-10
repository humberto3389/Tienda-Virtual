import LoadingSpinner from './LoadingSpinner';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#121212] overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Spinner */}
        <div className="mb-10">
          <LoadingSpinner size="xl" />
        </div>

        {/* Text Area */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-light text-white/90 tracking-tighter">
            Cargando experiencia
          </h2>
          
          <div className="flex items-center justify-center space-x-1.5">
            <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse [animation-delay:0.4s]"></div>
          </div>

          <p className="text-[10px] font-light text-gray-500 uppercase tracking-[0.4em] mt-8">
            Yersiman Solutions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;