"use client";

import { useState, useEffect } from "react";
import { 
  Palette, Sun, Moon, Laptop, 
  Globe, Languages, Bell, 
  Save, ShieldCheck, Zap,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

const translations = {
  en: {
    title: "System Preferences",
    subtitle: "Customize your Nexus workspace experience.",
    saveBtn: "Save Preferences",
    saving: "SAVING...",
    appearance: {
      title: "Appearance",
      theme: "Color Theme",
      light: "Light",
      dark: "Dark",
      system: "System",
      highContrast: "High Contrast Mode",
      highContrastDesc: "Increase color contrast across the UI.",
      reducedMotion: "Reduced Motion",
      reducedMotionDesc: "Disable non-essential animations.",
    },
    localization: {
      title: "Localization",
      lang: "Display Language",
      timezone: "Time Zone",
      autoDetect: "Auto-detect Location",
      autoDetectDesc: "Update timezone based on your IP.",
    },
    notifications: {
      title: "Notifications",
      email: "Email Notifications",
      emailDesc: "Receive summary reports and urgent alerts.",
      push: "Browser Push",
      pushDesc: "System-level alerts when you're connected.",
      slack: "Slack Integration",
      slackDesc: "Forward critical incidents to your team.",
      desktop: "Desktop App",
      desktopDesc: "Show badges on the dock/taskbar icon.",
    },
    security: {
      title: "Security",
      twoFactor: "Two-Factor Auth",
      twoFactorDesc: "Secure your account with 2FA.",
      enabledVia: "Enabled via Authenticator",
      manage: "Manage",
      activeSessions: "Active Sessions",
      activeSessionsDesc: "3 devices currently logged in.",
      logOutAll: "Log Out All",
      advAccess: "ADVANCED ACCESS",
      ssoDesc: "Enterprise SSO and biometric login are controlled by your organization's IT policy.",
      requestAccess: "Request Portal Access ↗",
    }
  },
  id: {
    title: "Preferensi Sistem",
    subtitle: "Sesuaikan pengalaman ruang kerja Nexus Anda.",
    saveBtn: "Simpan Pengaturan",
    saving: "MENYIMPAN...",
    appearance: {
      title: "Tampilan",
      theme: "Tema Warna",
      light: "Terang",
      dark: "Gelap",
      system: "Sistem",
      highContrast: "Mode Kontras Tinggi",
      highContrastDesc: "Tingkatkan kontras warna di seluruh UI.",
      reducedMotion: "Kurangi Animasi",
      reducedMotionDesc: "Nonaktifkan animasi yang tidak penting.",
    },
    localization: {
      title: "Lokalisasi",
      lang: "Bahasa Tampilan",
      timezone: "Zona Waktu",
      autoDetect: "Deteksi Lokasi Otomatis",
      autoDetectDesc: "Perbarui zona waktu otomatis berdasarkan IP Anda.",
    },
    notifications: {
      title: "Notifikasi",
      email: "Notifikasi Email",
      emailDesc: "Terima laporan dan peringatan mendesak.",
      push: "Push Browser",
      pushDesc: "Peringatan tingkat sistem saat terhubung.",
      slack: "Integrasi Slack",
      slackDesc: "Teruskan insiden kritis ke tim internal.",
      desktop: "Aplikasi Desktop",
      desktopDesc: "Tampilkan indikator di ikon komputer.",
    },
    security: {
      title: "Keamanan",
      twoFactor: "Otentikasi Dua Faktor",
      twoFactorDesc: "Amankan akun Anda dengan 2FA.",
      enabledVia: "Diaktifkan via Authenticator",
      manage: "Kelola",
      activeSessions: "Sesi Aktif",
      activeSessionsDesc: "3 perangkat sedang login.",
      logOutAll: "Keluar Semua",
      advAccess: "AKSES LANJUTAN",
      ssoDesc: "SSO Perusahaan dan login biometrik dikendalikan oleh kebijakan IT organisasi Anda.",
      requestAccess: "Minta Akses Portal ↗",
    }
  },
  jp: {
    title: "システム環境設定",
    subtitle: "Nexus エクスペリエンスをカスタマイズします。",
    saveBtn: "設定を保存",
    saving: "保存中...",
    appearance: {
      title: "外観",
      theme: "カラーテーマ",
      light: "ライト",
      dark: "ダーク",
      system: "システム",
      highContrast: "ハイコントラスト",
      highContrastDesc: "UI全体のカラーコントラストを上げます。",
      reducedMotion: "視差効果を減らす",
      reducedMotionDesc: "不要なアニメーションを無効にします。",
    },
    localization: {
      title: "地域化",
      lang: "表示言語",
      timezone: "タイムゾーン",
      autoDetect: "位置情報の自動検出",
      autoDetectDesc: "IPに基づいてタイムゾーンを更新します。",
    },
    notifications: {
      title: "通知",
      email: "メール通知",
      emailDesc: "サマリーと緊急アラートを受け取ります。",
      push: "ブラウザプッシュ",
      pushDesc: "接続時のシステムレベルのアラート。",
      slack: "Slack の統合",
      slackDesc: "重大なインシデントをチームに転送。",
      desktop: "デスクトップ",
      desktopDesc: "アイコンにバッジを表示します。",
    },
    security: {
      title: "セキュリティ",
      twoFactor: "二要素認証",
      twoFactorDesc: "2FAでアカウントを保護します。",
      enabledVia: "認証アプリで有効",
      manage: "管理",
      activeSessions: "アクティブセッション",
      activeSessionsDesc: "3つのデバイスがログイン中。",
      logOutAll: "すべてログアウト",
      advAccess: "高度なアクセス",
      ssoDesc: "エンタープライズSSOと生体認証ログインはITポリシーによって制御されます。",
      requestAccess: "アクセスをリクエスト ↗",
    }
  },
  zh: {
    title: "系统偏好设置",
    subtitle: "自定义您的 Nexus 工作区体验。",
    saveBtn: "保存设置",
    saving: "保存中...",
    appearance: {
      title: "外观",
      theme: "颜色主题",
      light: "浅色",
      dark: "深色",
      system: "系统",
      highContrast: "高对比度模式",
      highContrastDesc: "增加整个 UI 的颜色对比度。",
      reducedMotion: "减少动画",
      reducedMotionDesc: "禁用不必要的动画效果。",
    },
    localization: {
      title: "本地化",
      lang: "显示语言",
      timezone: "时区",
      autoDetect: "自动检测位置",
      autoDetectDesc: "根据您的 IP 更新时区。",
    },
    notifications: {
      title: "通知",
      email: "电子邮件通知",
      emailDesc: "接收摘要报告和紧急警报。",
      push: "浏览器推送",
      pushDesc: "连接时的系统级警报。",
      slack: "Slack 集成",
      slackDesc: "将严重事件转发给您的团队。",
      desktop: "桌面应用程序",
      desktopDesc: "在任务栏图标上显示徽章。",
    },
    security: {
      title: "安全",
      twoFactor: "双因素身份验证",
      twoFactorDesc: "使用 2FA 保护您的帐户。",
      enabledVia: "已通过身份验证器启用",
      manage: "管理",
      activeSessions: "活动会话",
      activeSessionsDesc: "当前有 3 台设备登录。",
      logOutAll: "注销所有",
      advAccess: "高级访问",
      ssoDesc: "企业 SSO 和生物识别登录由您组织的 IT 政策控制。",
      requestAccess: "请求门户访问 ↗",
    }
  },
  es: {
    title: "Preferencias del Sistema",
    subtitle: "Personalice su experiencia de Nexus.",
    saveBtn: "Guardar",
    saving: "GUARDANDO...",
    appearance: {
      title: "Apariencia",
      theme: "Tema de Color",
      light: "Claro",
      dark: "Oscuro",
      system: "Sistema",
      highContrast: "Alto Contraste",
      highContrastDesc: "Aumentar el contraste de la interfaz.",
      reducedMotion: "Reducir Movimiento",
      reducedMotionDesc: "Deshabilitar animaciones.",
    },
    localization: {
      title: "Localización",
      lang: "Idioma de Visualización",
      timezone: "Zona Horaria",
      autoDetect: "Ubicación Automática",
      autoDetectDesc: "Actualizar huso horario según IP.",
    },
    notifications: {
      title: "Notificaciones",
      email: "Notificación por Correo",
      emailDesc: "Reciba informes y alertas urgentes.",
      push: "Push del Navegador",
      pushDesc: "Alertas al conectarse.",
      slack: "Integración de Slack",
      slackDesc: "Reenviar incidentes críticos al equipo.",
      desktop: "App de Escritorio",
      desktopDesc: "Insignias en el icono de barra de tareas.",
    },
    security: {
      title: "Seguridad",
      twoFactor: "Autenticación (2FA)",
      twoFactorDesc: "Proteja su cuenta con 2FA.",
      enabledVia: "Habilitado (App)",
      manage: "Administrar",
      activeSessions: "Sesiones Activas",
      activeSessionsDesc: "3 dispositivos iniciados.",
      logOutAll: "Cerrar Todas",
      advAccess: "ACCESO AVANZADO",
      ssoDesc: "El SSO es controlado por la política de TI.",
      requestAccess: "Solicitar Acceso ↗",
    }
  }
};

export default function PreferencesPage() {
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  // States mapping everything in the UI
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [timezone, setTimezone] = useState("UTC+7");
  const [autoDetect, setAutoDetect] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notificationState, setNotificationState] = useState({
    email: true,
    push: false,
    slack: true,
    desktop: false,
  });

  const t = translations[lang as keyof typeof translations] || translations.en;

  // Load mock data on mount
  useEffect(() => {
    setMounted(true);
    // In a real app we would load preferences from the API here
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch for language switch

  const handleSave = () => {
    setSaving(true);
    // Simulate API pipeline
    setTimeout(() => {
      setSaving(false);
      
      // Accessibility side effects
      if (highContrast) {
        document.documentElement.classList.add("high-contrast-mode");
      } else {
        document.documentElement.classList.remove("high-contrast-mode");
      }

      if (reducedMotion) {
        document.documentElement.classList.add("reduce-motion");
      } else {
        document.documentElement.classList.remove("reduce-motion");
      }

      alert("Preferences saved successfully!");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 px-4 sm:px-0 mt-4 sm:mt-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-syne font-bold text-xl sm:text-2xl text-text-primary tracking-tight">{t.title}</h1>
          <p className="text-text-secondary mt-0.5 font-dmsans text-[11px] sm:text-sm">{t.subtitle}</p>
        </div>
        <Button 
           onClick={handleSave} 
           disabled={saving}
           className="w-full sm:w-auto h-8 bg-brand-default hover:bg-brand-hover text-white text-[11px] sm:text-xs font-bold transition-fast shadow-brand"
        >
          {saving ? t.saving : <><Save className="h-3.5 w-3.5 mr-2" /> {t.saveBtn}</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Appearance */}
        <Card className="bg-bg-surface border-border-subtle shadow-sm h-full rounded-xl overflow-hidden flex flex-col">
           <CardHeader className="pb-3 border-b border-border-subtle bg-bg-panel/50">
              <div className="flex items-center gap-2">
                 <Palette className="h-4 w-4 text-brand-text" />
                 <CardTitle className="text-[11px] sm:text-sm font-syne font-bold uppercase tracking-wider text-text-secondary">{t.appearance.title}</CardTitle>
              </div>
           </CardHeader>
           <CardContent className="pt-4 sm:pt-6 space-y-5 flex-1">
              <div className="space-y-3">
                 <Label className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">{t.appearance.theme}</Label>
                 <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      { id: "light", icon: Sun, label: t.appearance.light },
                      { id: "dark", icon: Moon, label: t.appearance.dark },
                      { id: "system", icon: Laptop, label: t.appearance.system },
                    ].map((btn) => {
                      const isActive = theme === btn.id || (!theme && btn.id === "system");
                      return (
                        <button
                          key={btn.id}
                          onClick={() => setTheme(btn.id)}
                          className={cn(
                            "flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-default",
                            isActive 
                              ? "bg-brand-muted border-brand-default/50 text-brand-text shadow-sm scale-[1.02]" 
                              : "bg-bg-sunken border-border-default text-text-tertiary hover:bg-bg-elevated hover:text-text-secondary hover:border-border-strong"
                          )}
                        >
                          <btn.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", isActive ? "animate-pulse" : "")} />
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">{btn.label}</span>
                        </button>
                      );
                    })}
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border-subtle">
                 <div className="flex items-center justify-between group">
                    <div className="space-y-0.5">
                       <Label className="text-xs sm:text-[13px] font-semibold text-text-primary cursor-pointer" onClick={() => setHighContrast(!highContrast)}>{t.appearance.highContrast}</Label>
                       <p className="text-[10px] sm:text-[11px] text-text-tertiary mr-4">{t.appearance.highContrastDesc}</p>
                    </div>
                    <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                 </div>
                 <div className="flex items-center justify-between group">
                    <div className="space-y-0.5">
                       <Label className="text-xs sm:text-[13px] font-semibold text-text-primary cursor-pointer" onClick={() => setReducedMotion(!reducedMotion)}>{t.appearance.reducedMotion}</Label>
                       <p className="text-[10px] sm:text-[11px] text-text-tertiary mr-4">{t.appearance.reducedMotionDesc}</p>
                    </div>
                    <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
                 </div>
              </div>
           </CardContent>
        </Card>

        {/* Localization & Region */}
        <Card className="bg-bg-surface border-border-subtle shadow-sm h-full rounded-xl overflow-hidden flex flex-col">
           <CardHeader className="pb-3 border-b border-border-subtle bg-bg-panel/50">
              <div className="flex items-center gap-2">
                 <Globe className="h-4 w-4 text-brand-text" />
                 <CardTitle className="text-[11px] sm:text-sm font-syne font-bold uppercase tracking-wider text-text-secondary">{t.localization.title}</CardTitle>
              </div>
           </CardHeader>
           <CardContent className="pt-4 sm:pt-6 space-y-5 flex-1">
              <div className="space-y-2.5">
                 <Label className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">{t.localization.lang}</Label>
                 <div className="relative">
                    <Languages className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
                    <select 
                       value={lang}
                       onChange={(e) => setLang(e.target.value)}
                       className="flex h-9 sm:h-10 w-full pl-9 rounded-md border border-border-default bg-bg-sunken px-3 py-2 text-[11px] sm:text-sm text-text-primary font-dmsans focus:outline-none focus:ring-2 focus:ring-brand-default transition-fast appearance-none cursor-pointer hover:bg-bg-elevated"
                    >
                       <option value="en">🇺🇸 English (US)</option>
                       <option value="zh">🇨🇳 中文 (Mandarin)</option>
                       <option value="es">🇪🇸 Español (Spanish)</option>
                       <option value="id">🇮🇩 Indonesia (Jakarta)</option>
                       <option value="ja">🇯🇵 日本語 (Japanese)</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary text-[10px]">▼</div>
                 </div>
              </div>

              <div className="space-y-2.5">
                 <Label className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">{t.localization.timezone}</Label>
                 <div className="relative">
                     <select 
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        disabled={autoDetect}
                        className={cn(
                          "flex h-9 sm:h-10 w-full rounded-md border border-border-default bg-bg-sunken px-3 py-2 text-[11px] sm:text-sm text-text-primary font-dmsans focus:outline-none focus:ring-2 focus:ring-brand-default transition-fast appearance-none cursor-pointer hover:bg-bg-elevated",
                          autoDetect ? "opacity-50 cursor-not-allowed" : ""
                        )}
                     >
                        <option value="UTC+7">(GMT+07:00) Jakarta, Bangkok</option>
                        <option value="UTC+8">(GMT+08:00) Singapore, Kuala Lumpur</option>
                        <option value="UTC+0">(GMT+00:00) London, UTC</option>
                     </select>
                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary text-[10px]">▼</div>
                 </div>
              </div>

              <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                 <div className="space-y-0.5">
                    <Label className="text-xs sm:text-[13px] font-semibold text-text-primary cursor-pointer" onClick={() => setAutoDetect(!autoDetect)}>{t.localization.autoDetect}</Label>
                    <p className="text-[10px] sm:text-[11px] text-text-tertiary mr-4">{t.localization.autoDetectDesc}</p>
                 </div>
                 <Switch checked={autoDetect} onCheckedChange={setAutoDetect} />
              </div>
           </CardContent>
        </Card>

        {/* Notification Tuning */}
        <Card className="bg-bg-surface border-border-subtle shadow-sm h-full rounded-xl overflow-hidden flex flex-col">
           <CardHeader className="pb-3 border-b border-border-subtle bg-bg-panel/50">
              <div className="flex items-center gap-2">
                 <Bell className="h-4 w-4 text-brand-text" />
                 <CardTitle className="text-[11px] sm:text-sm font-syne font-bold uppercase tracking-wider text-text-secondary">{t.notifications.title}</CardTitle>
              </div>
           </CardHeader>
           <CardContent className="pt-4 sm:pt-6 space-y-4 flex-1">
              {[
                { 
                  id: "email", 
                  label: t.notifications.email, 
                  desc: t.notifications.emailDesc 
                },
                { 
                  id: "push", 
                  label: t.notifications.push, 
                  desc: t.notifications.pushDesc 
                },
                { 
                  id: "slack", 
                  label: t.notifications.slack, 
                  desc: t.notifications.slackDesc 
                },
                { 
                  id: "desktop", 
                  label: t.notifications.desktop, 
                  desc: t.notifications.desktopDesc 
                },
              ].map((n) => (
                <div key={n.id} className="flex items-center justify-between group">
                   <div className="space-y-0.5">
                      <Label className="text-xs sm:text-[13px] font-semibold text-text-primary cursor-pointer" onClick={() => setNotificationState(p => ({ ...p, [n.id]: !p[n.id as keyof typeof p] }))}>{n.label}</Label>
                      <p className="text-[10px] sm:text-[11px] text-text-tertiary mr-4 leading-tight">{n.desc}</p>
                   </div>
                   <Switch 
                    checked={notificationState[n.id as keyof typeof notificationState]} 
                    onCheckedChange={(val) => setNotificationState(p => ({ ...p, [n.id]: val }))} 
                   />
                </div>
              ))}
           </CardContent>
        </Card>

        {/* Security & Access */}
        <Card className="bg-bg-surface border-border-subtle shadow-sm h-full rounded-xl overflow-hidden relative flex flex-col group">
           <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none transition-transform duration-700 group-hover:scale-125">
              <ShieldCheck className="h-40 w-40 sm:h-48 sm:w-48 text-brand-default" />
           </div>
           
           <CardHeader className="pb-3 border-b border-border-subtle bg-bg-panel/50 relative z-10">
              <div className="flex items-center gap-2">
                 <ShieldCheck className="h-4 w-4 text-brand-text" />
                 <CardTitle className="text-[11px] sm:text-sm font-syne font-bold uppercase tracking-wider text-text-secondary">{t.security.title}</CardTitle>
              </div>
           </CardHeader>
           <CardContent className="pt-4 sm:pt-6 space-y-5 flex-1 relative z-10">
              <div className="space-y-4">
                 <div className="flex items-center justify-between group">
                    <div className="space-y-0.5">
                       <Label className="text-xs sm:text-[13px] font-semibold text-text-primary">{t.security.twoFactor}</Label>
                       <p className="text-[10px] sm:text-[11px] text-text-tertiary mr-4">{t.security.twoFactorDesc}</p>
                       <p className="text-[9px] sm:text-[10px] text-emerald-500 font-bold uppercase flex items-center gap-1 mt-1">
                          <CheckCircle2 className="h-3 w-3" /> {t.security.enabledVia}
                       </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => alert("Redirecting to Advanced 2FA Setup...")} className="h-7 px-2.5 text-[10px] font-bold uppercase tracking-widest border-border-strong text-text-primary hover:bg-bg-elevated transition-colors">{t.security.manage}</Button>
                 </div>
                 <div className="flex items-center justify-between group">
                    <div className="space-y-0.5">
                       <Label className="text-xs sm:text-[13px] font-semibold text-text-primary">{t.security.activeSessions}</Label>
                       <p className="text-[10px] sm:text-[11px] text-text-tertiary mr-4">{t.security.activeSessionsDesc}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => alert("Logging out of all remote active sessions...")} className="h-7 px-2.5 text-[10px] font-bold uppercase tracking-widest border-crimson-500/20 text-crimson-500 hover:bg-crimson-500/10 transition-colors">{t.security.logOutAll}</Button>
                 </div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 mt-auto">
                <div className="flex items-center gap-2 mb-1.5 sm:mb-2 text-violet-500">
                   <Zap className="h-3.5 w-3.5" />
                   <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">{t.security.advAccess}</h4>
                </div>
                <p className="text-[10px] sm:text-[11px] text-text-secondary font-medium mb-3 leading-relaxed">{t.security.ssoDesc}</p>
                <Button onClick={() => alert("Request sent to IT admins. Ticket #SEC-0899 created.")} className="w-full h-8 bg-violet-500/10 hover:bg-violet-500/20 text-violet-500 border border-violet-500/30 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-none">
                  {t.security.requestAccess}
                </Button>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
