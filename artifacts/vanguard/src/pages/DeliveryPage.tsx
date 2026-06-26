import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, MapPin, Clock, CheckCircle, Truck, User, Phone, Loader2, Search, AlertTriangle } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Driver = { id: number; name: string; phone: string; rating: number; vehicle: string; plateNumber: string };
type DeliveryTracking = { id: number; status: string; location?: string; updatedAt: string; note?: string };
type Delivery = {
  id: number;
  orderId: number;
  driverId?: number;
  driver?: Driver;
  status: string;
  pickupAddress: string;
  deliveryAddress: string;
  estimatedDelivery?: string;
  tracking: DeliveryTracking[];
  createdAt: string;
};

const ME = 1;

const STATUS_STEPS = ["assigned", "picked_up", "in_transit", "arrived", "delivered"];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Truck }> = {
  pending:    { label: "Pending",     color: "text-amber-600 bg-amber-50 border-amber-200",   icon: Clock },
  assigned:   { label: "Assigned",    color: "text-blue-600 bg-blue-50 border-blue-200",      icon: User },
  picked_up:  { label: "Picked Up",   color: "text-indigo-600 bg-indigo-50 border-indigo-200", icon: Package },
  in_transit: { label: "In Transit",  color: "text-purple-600 bg-purple-50 border-purple-200", icon: Truck },
  arrived:    { label: "Arrived",     color: "text-teal-600 bg-teal-50 border-teal-200",       icon: MapPin },
  delivered:  { label: "Delivered",   color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: CheckCircle },
  failed:     { label: "Failed",      color: "text-red-600 bg-red-50 border-red-200",          icon: AlertTriangle },
};

const MOCK_DELIVERIES: Delivery[] = [
  {
    id: 1, orderId: 1001, status: "in_transit",
    pickupAddress: "Ikeja, Lagos", deliveryAddress: "Lekki Phase 1, Lagos",
    estimatedDelivery: new Date(Date.now() + 2 * 3600_000).toISOString(),
    driver: { id: 1, name: "Chukwuemeka Obi", phone: "+234 803 456 7890", rating: 4.8, vehicle: "Motorcycle", plateNumber: "LAG-123-KJ" },
    tracking: [
      { id: 1, status: "assigned", location: "Ikeja", updatedAt: new Date(Date.now() - 90 * 60000).toISOString(), note: "Driver assigned" },
      { id: 2, status: "picked_up", location: "Ikeja Market", updatedAt: new Date(Date.now() - 60 * 60000).toISOString(), note: "Package picked up" },
      { id: 3, status: "in_transit", location: "Victoria Island", updatedAt: new Date(Date.now() - 20 * 60000).toISOString(), note: "En route to destination" },
    ],
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    id: 2, orderId: 1002, status: "delivered",
    pickupAddress: "Wuse 2, Abuja", deliveryAddress: "Garki, Abuja",
    driver: { id: 2, name: "Fatima Aliyu", phone: "+234 805 678 9012", rating: 4.9, vehicle: "Car", plateNumber: "ABJ-456-FC" },
    tracking: [
      { id: 1, status: "assigned", location: "Wuse 2", updatedAt: new Date(Date.now() - 5 * 3600_000).toISOString() },
      { id: 2, status: "picked_up", location: "Wuse 2", updatedAt: new Date(Date.now() - 4 * 3600_000).toISOString() },
      { id: 3, status: "in_transit", location: "Central Area", updatedAt: new Date(Date.now() - 3 * 3600_000).toISOString() },
      { id: 4, status: "delivered", location: "Garki", updatedAt: new Date(Date.now() - 2 * 3600_000).toISOString(), note: "Package delivered successfully" },
    ],
    createdAt: new Date(Date.now() - 6 * 3600_000).toISOString(),
  },
  {
    id: 3, orderId: 1003, status: "pending",
    pickupAddress: "Alaba, Lagos", deliveryAddress: "Surulere, Lagos",
    tracking: [],
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
];

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function DeliveryPage() {
  const [selected, setSelected] = useState<Delivery>(MOCK_DELIVERIES[0]);
  const [trackingId, setTrackingId] = useState("");

  const activeStep = STATUS_STEPS.indexOf(selected.status);
  const cfg = STATUS_CONFIG[selected.status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Delivery Tracking</h1>
        <p className="text-muted-foreground text-sm">Track your orders in real time.</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={trackingId} onChange={(e) => setTrackingId(e.target.value)} placeholder="Enter tracking ID or order number..." className="w-full pl-10 pr-4 py-3 rounded-2xl border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Your Deliveries</h2>
          {MOCK_DELIVERIES.map((d) => {
            const c = STATUS_CONFIG[d.status] ?? STATUS_CONFIG.pending;
            const I = c.icon;
            return (
              <button key={d.id} onClick={() => setSelected(d)} className={`w-full text-left rounded-2xl border p-4 transition ${selected.id === d.id ? "ring-2 ring-primary bg-primary/5" : "bg-card hover:shadow-sm"}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-2 rounded-xl border ${c.color}`}><I className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-sm">Order #{d.orderId}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${c.color}`}>{c.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{d.deliveryAddress}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(d.createdAt)}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-3 rounded-2xl border bg-card p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className={`p-3 rounded-2xl border ${cfg.color}`}><Icon className="h-5 w-5" /></div>
            <div>
              <h2 className="font-bold">Order #{selected.orderId}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.label}</span>
            </div>
            {selected.estimatedDelivery && (
              <div className="ml-auto text-right">
                <p className="text-xs text-muted-foreground">ETA</p>
                <p className="text-sm font-semibold">{new Date(selected.estimatedDelivery).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            )}
          </div>

          {selected.status !== "pending" && (
            <div className="mb-5">
              <div className="flex items-center gap-1 mb-2">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex-1 flex flex-col items-center">
                    <div className={`h-2 rounded-full w-full ${i <= activeStep ? "bg-primary" : "bg-muted"}`} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Assigned</span><span>Picked Up</span><span>In Transit</span><span>Arrived</span><span>Delivered</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">Pickup</p>
              <p className="text-sm font-medium">{selected.pickupAddress}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">Delivery</p>
              <p className="text-sm font-medium">{selected.deliveryAddress}</p>
            </div>
          </div>

          {selected.driver && (
            <div className="rounded-xl border p-3 mb-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">{selected.driver.name[0]}</div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{selected.driver.name}</p>
                <p className="text-xs text-muted-foreground">{selected.driver.vehicle} · {selected.driver.plateNumber} · ⭐ {selected.driver.rating}</p>
              </div>
              <a href={`tel:${selected.driver.phone}`} className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition">
                <Phone className="h-4 w-4" />
              </a>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold mb-3">Tracking History</h3>
            {selected.tracking.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Awaiting driver assignment</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...selected.tracking].reverse().map((t, i) => {
                  const tc = STATUS_CONFIG[t.status] ?? STATUS_CONFIG.pending;
                  const TI = tc.icon;
                  return (
                    <div key={t.id} className="flex gap-3">
                      <div className={`mt-0.5 p-1.5 rounded-lg border ${tc.color}`}><TI className="h-3.5 w-3.5" /></div>
                      <div>
                        <p className="text-sm font-medium">{tc.label}{t.location ? ` · ${t.location}` : ""}</p>
                        {t.note && <p className="text-xs text-muted-foreground">{t.note}</p>}
                        <p className="text-xs text-muted-foreground">{timeAgo(t.updatedAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
