type GuardianAlert = {
  id: number;
  severity: string;
  title: string;
  message: string;
  action: string;
  createdAt?: string;
};

interface GuardianAlertsTableProps {
  alerts: GuardianAlert[];
}

export default function GuardianAlertsTable({
  alerts,
}: GuardianAlertsTableProps) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="font-semibold">
          Guardian Alerts
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left p-3">
                Severity
              </th>

              <th className="text-left p-3">
                Title
              </th>

              <th className="text-left p-3">
                Message
              </th>

              <th className="text-left p-3">
                Action
              </th>

              <th className="text-left p-3">
                Created
              </th>
            </tr>
          </thead>

          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-muted-foreground"
                >
                  No Guardian alerts found
                </td>
              </tr>
            ) : (
              alerts.map(
                (alert) => (
                  <tr
                    key={alert.id}
                    className="border-b"
                  >
                    <td className="p-3">
                      {alert.severity}
                    </td>

                    <td className="p-3 font-medium">
                      {alert.title}
                    </td>

                    <td className="p-3">
                      {alert.message}
                    </td>

                    <td className="p-3">
                      {alert.action}
                    </td>

                    <td className="p-3">
                      {alert.createdAt
                        ? new Date(
                            alert.createdAt,
                          ).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}