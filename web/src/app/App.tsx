import { StoreProvider } from "./store";
import { AdminApp } from "./components/AdminApp";

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-gray-50 to-zinc-100">
        {/* 顶部导航栏 */}
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
          <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-sm">
                <span className="text-lg">🐷</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">花小猪打车 · 运营管理平台</div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  运营端 · 管理后台
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto p-5">
          <div className="py-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              运营端 · 完整管理体验
            </div>
            <AdminApp />
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}
