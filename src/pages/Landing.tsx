import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "../components/common/LanguageSelector";
import { D20Icon } from "../components/common/D20Icon";
import { useAuth } from "../hooks/useAuth";

export const Landing: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-space relative">
      {/* Language selector — tucked top-right, secondary to main actions */}
      <div className="absolute top-4 right-4">
        <LanguageSelector variant="compact" />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <D20Icon size={128} className="drop-shadow-2xl animate-pulse" />
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {t("landing.title")}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            {t("landing.subtitle")}
          </p>

          {/* Description */}
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            {t("landing.description")}
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mt-4">
            <div className="bg-dark-surface/50 backdrop-blur p-8 rounded-lg border border-dark-elevated text-left">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {t("landing.forGMs")}
              </h3>
              <p className="text-gray-400 mb-6">{t("landing.gmDescription")}</p>
              <div className="flex gap-3">
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-cyber-500 hover:bg-cyber-600 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  {t("auth.signUp")} →
                </Link>
                <Link
                  to="/login"
                  className="px-5 py-2 bg-dark-bg hover:bg-dark-elevated text-gray-300 hover:text-white font-semibold rounded-lg transition-colors text-sm border border-dark-elevated"
                >
                  {t("auth.signIn")}
                </Link>
              </div>
            </div>

            <div className="bg-dark-surface/50 backdrop-blur p-8 rounded-lg border border-dark-elevated text-left">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {t("landing.forPlayers")}
              </h3>
              <p className="text-gray-400 mb-4">
                {t("landing.playerDescription")}
              </p>
              <p className="text-sm text-gray-500 border-t border-dark-elevated pt-4">
                {t("landing.playerNoAccount")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-dark-elevated py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>RPG Survey Creator - Helping GMs create better campaigns</p>
        </div>
      </footer>
    </div>
  );
};
