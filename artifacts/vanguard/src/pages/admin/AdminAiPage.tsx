import { useEffect, useState } from "react";

export default function AdminAiPage() {
  const [alerts, setAlerts] =
    useState<any[]>([]);

  const [fraudCases, setFraudCases] =
    useState<any[]>([]);

  const [riskAssessments, setRiskAssessments] =
    useState<any[]>([]);

  const [actions, setActions] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [
          alertsRes,
          fraudRes,
          riskRes,
          actionsRes,
        ] = await Promise.all([
          fetch(
            "/api/admin-ai/alerts",
          ),
          fetch(
            "/api/admin-ai/fraud-cases",
          ),
          fetch(
            "/api/admin-ai/risk-assessments",
          ),
          fetch(
            "/api/admin-ai/actions",
          ),
        ]);

        const alertsData =
          await alertsRes.json();

        const fraudData =
          await fraudRes.json();

        const riskData =
          await riskRes.json();

        const actionsData =
          await actionsRes.json();

        setAlerts(
          alertsData,
        );

        setFraudCases(
          fraudData,
        );

        setRiskAssessments(
          riskData,
        );

        setActions(
          actionsData,
        );
      } catch (error) {
        console.error(
          error,
        );
      } finally {
        setLoading(
          false,
        );
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Loading Guardian AI...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Guardian AI
        </h1>

        <p className="text-muted-foreground">
          Vanguard AI Security Dashboard
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm">
            Alerts
          </p>

          <p className="text-2xl font-bold">
            {alerts.length}
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-sm">
            Fraud Cases
          </p>

          <p className="text-2xl font-bold">
            {
              fraudCases.length
            }
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-sm">
            Risks
          </p>

          <p className="text-2xl font-bold">
            {
              riskAssessments.length
            }
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-sm">
            Actions
          </p>

          <p className="text-2xl font-bold">
            {
              actions.length
            }
          </p>
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="font-semibold">
            Recent Alerts
          </h2>
        </div>

        <div className="divide-y">
          {alerts.map(
            (alert) => (
              <div
                key={
                  alert.id
                }
                className="p-4"
              >
                <p className="font-medium">
                  {
                    alert.title
                  }
                </p>

                <p className="text-sm text-muted-foreground">
                  {
                    alert.message
                  }
                </p>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="font-semibold">
            Fraud Cases
          </h2>
        </div>

        <div className="divide-y">
          {fraudCases.map(
            (item) => (
              <div
                key={
                  item.id
                }
                className="p-4"
              >
                <p className="font-medium">
                  {
                    item.caseType
                  }
                </p>

                <p className="text-sm text-muted-foreground">
                  {
                    item.status
                  }
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}