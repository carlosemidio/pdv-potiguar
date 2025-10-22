export function getDaysCountFromNow(date: string | undefined) {
    if (!date) return 0
    return Math.round(((new Date(date).getTime()) - (new Date().getTime())) / (1000 * 60 * 60 * 24))
}

export function intToBRL(value = 0) {
    return "R$ " + (value).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
}

export function intBRLToStrBRL(value: number | undefined) {
    if (!value) return undefined;
    return (value).toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2, useGrouping: false })
}

export function strBRLToIntBRL(value: string | undefined) {
    if (!value) return undefined;
    return Number(value.replace(/\D/g, ''))
}

export function formatCurrency(amount: number) {
    return amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}