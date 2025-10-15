# Diretrizes para Larguras de Modais

## Padrões de Largura por Tipo de Formulário

### `maxWidth="lg"` (512px) - Formulários Simples
**Recomendado para:** Formulários com poucos campos (2-4 campos principais)
- ✅ CategoryFormModal
- ✅ BrandFormModal 
- ✅ AddonIngredientFormModal
- Formulários de login/registro
- Formulários de confirmação

### `maxWidth="xl"` (576px) - Formulários Padrão
**Recomendado para:** Formulários com quantidade média de campos (4-6 campos)
- ✅ CustomerFormModal
- Formulários de usuários
- Formulários de produtos simples

### `maxWidth="2xl"` (672px) - Formulários Complexos
**Recomendado para:** Formulários com muitos campos ou campos especiais
- ✅ PrinterFormModal
- Formulários de configuração
- Formulários com uploads de imagem
- Formulários com campos de texto longos

### `maxWidth="3xl"` (768px) - Formulários Avançados
**Recomendado para:** Formulários com layout em duas colunas ou muitos campos
- Formulários de produtos completos
- Formulários de pedidos complexos
- Formulários com múltiplas seções

### `maxWidth="4xl"` (896px) e acima - Formulários Extensos
**Recomendado para:** Formulários muito complexos ou com conteúdo rico
- Formulários de configuração avançada
- Editores de conteúdo
- Dashboards em modal

## Regras de Implementação

### ✅ Correto
```tsx
// Modal base controla border-radius (rounded-2xl), padding e largura automaticamente
<Modal show={isOpen} onClose={onClose} maxWidth="lg">
    <div className="bg-white dark:bg-gray-800 shadow-xl w-full">
        {/* conteúdo */}
    </div>
</Modal>
```

### ❌ Incorreto
```tsx
// Não duplicar border-radius, padding ou largura - pode causar conflitos
<Modal show={isOpen} onClose={onClose}>
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4">
        {/* conteúdo */}
    </div>
</Modal>
```

## Diretrizes de Design

1. **Consistência**: Todos os modais do mesmo tipo devem usar a mesma largura
2. **Responsividade**: As larguras são responsivas automaticamente
3. **Conteúdo**: A largura deve acomodar o conteúdo sem sobrar muito espaço
4. **UX**: Evite modais muito largos em telas pequenas
5. **Legibilidade**: Linhas de texto não devem ser muito longas
6. **Estilo Unificado**: Modal base controla border-radius (rounded-2xl), padding e sombra
7. **Limpeza**: Não duplique estilos que já são aplicados pelo Modal base

## Larguras Atuais dos Modais Modernizados

| Modal | Largura | Justificativa |
|-------|---------|---------------|
| CategoryFormModal | `lg` | Formulário simples (nome, parent, status) |
| BrandFormModal | `lg` | Formulário simples (nome, descrição) |
| AddonIngredientFormModal | `lg` | Formulário simples (seleção e quantidade) |
| TableFormModal | `lg` | Formulário simples (nome da mesa) |
| CustomerFormModal | `xl` | Formulário com mais campos (dados pessoais) |
| PrinterFormModal | `2xl` | Formulário complexo (configurações técnicas) |

## Próximos Passos

Ao modernizar novos modais, sempre:
1. Avaliar a quantidade e complexidade dos campos
2. Escolher a largura apropriada da tabela acima
3. Usar o parâmetro `maxWidth` do Modal
4. Remover classes de largura customizadas do div interno
5. Testar em diferentes tamanhos de tela