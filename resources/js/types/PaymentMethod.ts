export default interface PaymentMethod {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
}