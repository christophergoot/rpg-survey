import React, { useState } from "react";
import {
  useAdmins,
  useSendInvitation,
  useCancelInvitation,
  useRemoveAdmin,
} from "../../hooks/useAdmins";
import { SurveyInvitation } from "../../lib/types";

interface AdminsPanelProps {
  surveyId: string;
}

export const AdminsPanel: React.FC<AdminsPanelProps> = ({ surveyId }) => {
  const { data, isLoading, error } = useAdmins(surveyId);
  const sendInvitation = useSendInvitation(surveyId);
  const cancelInvitation = useCancelInvitation(surveyId);
  const removeAdmin = useRemoveAdmin(surveyId);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [modalInvitation, setModalInvitation] =
    useState<SurveyInvitation | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    setInviteSuccess(false);
    if (!inviteEmail.trim()) return;

    try {
      await sendInvitation.mutateAsync(inviteEmail.trim());
      setInviteEmail("");
      setInviteSuccess(true);
      setTimeout(() => setInviteSuccess(false), 3000);
    } catch (err) {
      setInviteError((err as Error).message);
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    if (
      !window.confirm(
        "Remove this co-admin? They will lose access to this survey.",
      )
    )
      return;
    setRemovingId(adminId);
    try {
      await removeAdmin.mutateAsync(adminId);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setRemovingId(null);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    setCancelingId(invitationId);
    try {
      await cancelInvitation.mutateAsync(invitationId);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setCancelingId(null);
    }
  };

  const getInviteUrl = (token: string) =>
    new URL(`#/invite/${token}`, window.location.href).href;

  const handleCopyMessage = async (inv: SurveyInvitation) => {
    const url = getInviteUrl(inv.token);
    const expiry = new Date(inv.expires_at).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const message = `You've been invited to co-administer a survey on RPG Survey.\n\nClick the link below to accept. You'll need to sign in or create an account if you don't have one.\n\n${url}\n\nThis invitation expires on ${expiry}.`;
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-400">
        Failed to load administrators.
      </div>
    );
  }

  const admins = data?.admins ?? [];
  const invitations = data?.invitations ?? [];

  return (
    <div className="space-y-8">
      {/* Co-Admins List */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Co-Administrators
        </h3>
        {admins.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No co-admins yet. Invite someone below.
          </p>
        ) : (
          <div className="space-y-2">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-elevated"
              >
                <div>
                  <p className="font-medium text-white">
                    {admin.display_name ?? admin.email}
                  </p>
                  <p className="text-sm text-gray-400">{admin.email}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Added {new Date(admin.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveAdmin(admin.id)}
                  disabled={removingId === admin.id}
                  className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded transition-colors disabled:opacity-50"
                >
                  {removingId === admin.id ? "..." : "Remove"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Pending Invitations
          </h3>
          <div className="space-y-2">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-elevated border-dashed"
              >
                <div>
                  <p className="font-medium text-gray-300">
                    {inv.invited_email}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Expires {new Date(inv.expires_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setModalInvitation(inv)}
                    className="px-3 py-1.5 bg-dark-elevated hover:bg-dark-bg text-gray-300 hover:text-white text-sm rounded transition-colors"
                  >
                    Copy Instructions
                  </button>
                  <button
                    onClick={() => handleCancelInvitation(inv.id)}
                    disabled={cancelingId === inv.id}
                    className="px-3 py-1.5 bg-dark-elevated hover:bg-dark-bg text-gray-400 hover:text-white text-sm rounded transition-colors disabled:opacity-50"
                  >
                    {cancelingId === inv.id ? "..." : "Cancel"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Form */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Invite a Co-Admin
        </h3>
        <form onSubmit={handleSendInvite} className="flex gap-3">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => {
              setInviteEmail(e.target.value);
              setInviteError(null);
            }}
            placeholder="email@example.com"
            required
            className="flex-1 px-4 py-2.5 bg-dark-bg border border-dark-elevated rounded-lg focus:outline-none focus:border-cyber-500 text-white placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={sendInvitation.isPending}
            className="px-5 py-2.5 bg-cyber-500 hover:bg-cyber-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            {sendInvitation.isPending ? "Sending..." : "Send Invite"}
          </button>
        </form>
        {inviteError && (
          <p className="mt-2 text-sm text-red-400">{inviteError}</p>
        )}
        {inviteSuccess && (
          <p className="mt-2 text-sm text-green-400">Invitation sent!</p>
        )}
      </div>
      {/* Instructions Modal */}
      {modalInvitation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setModalInvitation(null)}
        >
          <div
            className="w-full max-w-md bg-dark-card border border-dark-elevated rounded-xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white">
              Invitation Instructions
            </h3>
            <p className="text-sm text-gray-400">
              Share this message with{" "}
              <span className="text-gray-200">
                {modalInvitation.invited_email}
              </span>
              .
            </p>
            <div className="bg-dark-bg rounded-lg p-4 space-y-3 text-sm text-gray-300">
              <p>
                You've been invited to co-administer a survey on RPG Survey.
              </p>
              <p>
                Click the link below to accept. You'll need to sign in or create
                an account if you don't have one.
              </p>
              <p className="break-all text-cyber-400">
                {getInviteUrl(modalInvitation.token)}
              </p>
              <p className="text-xs text-gray-500">
                This invitation expires on{" "}
                {new Date(modalInvitation.expires_at).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" },
                )}
                .
              </p>
            </div>
            <button
              onClick={() => handleCopyMessage(modalInvitation)}
              className="w-full px-4 py-2.5 bg-cyber-500 hover:bg-cyber-600 text-white font-semibold rounded-lg transition-colors"
            >
              {copied ? "Copied!" : "Copy Message"}
            </button>
            <button
              onClick={() => setModalInvitation(null)}
              className="w-full px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
