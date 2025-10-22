import PaymentMethod from "@/types/PaymentMethod";
import { Banknote, CreditCard, Wallet, Zap } from "lucide-react";

const paymentMethods: PaymentMethod[] = [
  {
    key: "cash",
    label: "Dinheiro",
    icon: Banknote,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-300 dark:border-green-700",
  },
  {
    key: "pix",
    label: "PIX",
    icon: Zap,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-300 dark:border-blue-700",
  },
  {
    key: "debit_card",
    label: "Cartão de Débito",
    icon: CreditCard,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-300 dark:border-purple-700",
  },
  {
    key: "credit_card",
    label: "Cartão de Crédito",
    icon: CreditCard,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-300 dark:border-indigo-700",
  },
  {
    key: "other",
    label: "Outro",
    icon: Wallet,
    color: "text-gray-600",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    borderColor: "border-gray-300 dark:border-gray-700",
  },
];

export default paymentMethods;