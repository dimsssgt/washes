import OrderStatus, { OperatingHours } from "@/components/landingpage/OrderStatus";

export default function StatusAndHours() {
  return (
    <section className="bg-grid border-b-[3px] border-ink py-60">
      <div className="container-lk grid items-start gap-9 md:grid-cols-2">
        <OrderStatus />
        <OperatingHours />
      </div>
    </section>
  );
}
