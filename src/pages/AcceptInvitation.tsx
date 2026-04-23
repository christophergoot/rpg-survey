import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useInvitationByToken,
  useAcceptInvitation,
} from "../hooks/useInvitation";
import { Header } from "../components/common/Header";

export const AcceptInvitation: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [accepted, setAccepted] = useState(false);
  const [acceptedSurveyId, setAcceptedSurveyId] = useState<string | null>(null);
  const [acceptedSurveyTitle, setAcceptedSurveyTitle] = useState<string | null>(
    null,
  );
  const idempotentAcceptStartedRef = useRef(false);

  const {
    data: invitation,
    isLoading,
    error: fetchError,
  } = useInvitationByToken(token ?? "");
  const acceptMutation = useAcceptInvitation();
  const { mutate: acceptInviteMutate, reset: resetAcceptMutation } =
    acceptMutation;

  const handleAccept = async () => {
    if (!invitation) return;
    try {
      const result = await acceptMutation.mutateAsync({
        surveyId: invitation.survey_id,
        token: token!,
      });
      setAcceptedSurveyId(result.survey_id);
      setAcceptedSurveyTitle(result.survey_title);
      setAccepted(true);
    } catch {
      // error shown via acceptMutation.error
    }
  };

  const invitationNotExpired =
    !!invitation && new Date(invitation.expires_at) > new Date();
  const emailsMatch =
    !!user &&
    !!invitation &&
    user.email.toLowerCase() === invitation.invited_email.toLowerCase();

  useEffect(() => {
    if (!invitation || !token || !user || !invitationNotExpired) return;
    if (invitation.accepted_at === null) return;
    if (!emailsMatch) return;
    if (idempotentAcceptStartedRef.current) return;
    idempotentAcceptStartedRef.current = true;

    acceptInviteMutate(
      { surveyId: invitation.survey_id, token },
      {
        onSuccess: (data) => {
          navigate(`/results/${data.survey_id}`);
        },
      },
    );
  }, [
    invitation,
    token,
    user,
    invitationNotExpired,
    emailsMatch,
    navigate,
    acceptInviteMutate,
  ]);

  const handleRetryIdempotentAccept = () => {
    if (!invitation || !token || !user) return;
    idempotentAcceptStartedRef.current = false;
    resetAcceptMutation();
    idempotentAcceptStartedRef.current = true;
    acceptInviteMutate(
      { surveyId: invitation.survey_id, token },
      {
        onSuccess: (data) => {
          navigate(`/results/${data.survey_id}`);
        },
      },
    );
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-space">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-dark-surface rounded-lg shadow-xl border border-dark-elevated p-8">
            {/* Loading */}
            {isLoading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyber-500 mb-4"></div>
                <p className="text-gray-400">Loading invitation...</p>
              </div>
            )}

            {/* Not found */}
            {!isLoading && fetchError && (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🔗</div>
                <h1 className="text-xl font-bold text-white mb-2">
                  Invalid Invitation
                </h1>
                <p className="text-gray-400">
                  This invitation link is invalid or has been revoked.
                </p>
              </div>
            )}

            {/* Invitation loaded */}
            {!isLoading && !fetchError && invitation && (
              <>
                {/* Expired */}
                {new Date(invitation.expires_at) <= new Date() && (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-4">⏰</div>
                    <h1 className="text-xl font-bold text-white mb-2">
                      Invitation Expired
                    </h1>
                    <p className="text-gray-400">
                      This invitation has expired. Ask the survey owner to send
                      a new one.
                    </p>
                  </div>
                )}

                {/* Already accepted — not expired */}
                {invitation.accepted_at !== null && invitationNotExpired && (
                  <>
                    {user && emailsMatch ? (
                      <div className="text-center py-8">
                        {acceptMutation.isError ? (
                          <>
                            <div className="text-5xl mb-4">⚠️</div>
                            <h1 className="text-xl font-bold text-white mb-2">
                              Could not open results
                            </h1>
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-400 text-sm">
                              {(acceptMutation.error as Error).message}
                            </div>
                            <button
                              type="button"
                              onClick={handleRetryIdempotentAccept}
                              disabled={acceptMutation.isPending}
                              className="w-full px-4 py-3 bg-cyber-500 hover:bg-cyber-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                            >
                              Retry
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyber-500 mb-4"></div>
                            <p className="text-gray-400">
                              Taking you to results…
                            </p>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-5xl mb-4">✅</div>
                        <h1 className="text-xl font-bold text-white mb-2">
                          Already Accepted
                        </h1>
                        <p className="text-gray-400 mb-6">
                          This invitation has already been used.
                        </p>

                        {!user && (
                          <>
                            <p className="text-sm text-gray-400 text-center mb-4">
                              Sign in or create an account with{" "}
                              <strong className="text-white">
                                {invitation.invited_email}
                              </strong>{" "}
                              to view this survey&apos;s results.
                            </p>
                            <div className="flex flex-col gap-3">
                              <Link
                                to="/login"
                                state={{ returnTo: `/invite/${token}` }}
                                className="w-full px-4 py-3 bg-cyber-500 hover:bg-cyber-600 text-white font-semibold rounded-lg transition-colors text-center"
                              >
                                Sign In
                              </Link>
                              <Link
                                to="/signup"
                                state={{ returnTo: `/invite/${token}` }}
                                className="w-full px-4 py-3 bg-dark-elevated hover:bg-dark-bg text-gray-300 font-semibold rounded-lg transition-colors text-center"
                              >
                                Create Account
                              </Link>
                            </div>
                          </>
                        )}

                        {user &&
                          user.email.toLowerCase() !==
                            invitation.invited_email.toLowerCase() && (
                            <div>
                              <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-left">
                                <p className="text-yellow-400 text-sm">
                                  This invitation was sent to{" "}
                                  <strong>{invitation.invited_email}</strong>.
                                  You&apos;re signed in as{" "}
                                  <strong>{user.email}</strong>.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={handleSignOut}
                                className="w-full px-4 py-3 bg-dark-elevated hover:bg-dark-bg text-gray-300 font-semibold rounded-lg transition-colors"
                              >
                                Sign Out & Switch Account
                              </button>
                            </div>
                          )}
                      </div>
                    )}
                  </>
                )}

                {/* Valid invitation (pending accept) */}
                {invitation.accepted_at === null && invitationNotExpired && (
                  <>
                    {/* Accepted success state */}
                    {accepted && acceptedSurveyId && (
                      <div className="text-center py-8">
                        <div className="text-5xl mb-4">🎲</div>
                        <h1 className="text-xl font-bold text-white mb-2">
                          You're in!
                        </h1>
                        <p className="text-gray-400 mb-6">
                          You're now a co-admin of "{acceptedSurveyTitle}".
                        </p>
                        <button
                          onClick={() =>
                            navigate(`/results/${acceptedSurveyId}`)
                          }
                          className="px-6 py-3 bg-cyber-500 hover:bg-cyber-600 text-white font-semibold rounded-lg transition-colors"
                        >
                          Go to Results
                        </button>
                      </div>
                    )}

                    {/* Not yet accepted */}
                    {!accepted && (
                      <>
                        {/* Invitation context */}
                        <div className="text-center mb-6">
                          <div className="text-4xl mb-3">🎲</div>
                          <h1 className="text-2xl font-bold text-white mb-1">
                            Survey Invitation
                          </h1>
                        </div>
                        <div className="bg-dark-bg rounded-lg p-4 mb-4">
                          <p className="text-xs text-gray-400 mb-1">
                            Invited by
                          </p>
                          <p className="font-semibold text-cyber-400">
                            {invitation.inviter_display_name}
                          </p>
                        </div>
                        <div className="bg-dark-bg rounded-lg p-4 mb-6">
                          <p className="text-xs text-gray-400 mb-1">Survey</p>
                          <p className="font-semibold text-white">
                            {invitation.survey_title}
                          </p>
                        </div>

                        {/* Not logged in */}
                        {!user && (
                          <>
                            <p className="text-sm text-gray-400 text-center mb-4">
                              Sign in or create an account to accept this
                              invitation.
                            </p>
                            <div className="flex flex-col gap-3">
                              <Link
                                to="/login"
                                state={{ returnTo: `/invite/${token}` }}
                                className="w-full px-4 py-3 bg-cyber-500 hover:bg-cyber-600 text-white font-semibold rounded-lg transition-colors text-center"
                              >
                                Sign In
                              </Link>
                              <Link
                                to="/signup"
                                state={{ returnTo: `/invite/${token}` }}
                                className="w-full px-4 py-3 bg-dark-elevated hover:bg-dark-bg text-gray-300 font-semibold rounded-lg transition-colors text-center"
                              >
                                Create Account
                              </Link>
                            </div>
                          </>
                        )}

                        {/* Logged in as wrong email */}
                        {user &&
                          user.email.toLowerCase() !==
                            invitation.invited_email.toLowerCase() && (
                            <div>
                              <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                <p className="text-yellow-400 text-sm">
                                  This invitation was sent to{" "}
                                  <strong>{invitation.invited_email}</strong>.
                                  You're signed in as{" "}
                                  <strong>{user.email}</strong>.
                                </p>
                              </div>
                              <button
                                onClick={handleSignOut}
                                className="w-full px-4 py-3 bg-dark-elevated hover:bg-dark-bg text-gray-300 font-semibold rounded-lg transition-colors"
                              >
                                Sign Out & Switch Account
                              </button>
                            </div>
                          )}

                        {/* Logged in as correct email */}
                        {user &&
                          user.email.toLowerCase() ===
                            invitation.invited_email.toLowerCase() && (
                            <>
                              <p className="text-sm text-gray-400 text-center mb-4">
                                Signed in as{" "}
                                <strong className="text-white">
                                  {user.email}
                                </strong>
                              </p>

                              {acceptMutation.isError && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-400 text-sm">
                                  {(acceptMutation.error as Error).message}
                                </div>
                              )}

                              <button
                                onClick={handleAccept}
                                disabled={acceptMutation.isPending}
                                className="w-full px-4 py-3 bg-cyber-500 hover:bg-cyber-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                              >
                                {acceptMutation.isPending
                                  ? "Accepting..."
                                  : "Accept Invitation"}
                              </button>
                            </>
                          )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
