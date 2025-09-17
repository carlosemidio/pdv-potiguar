import { Variant } from "@/types/Variant"
import PrimaryButton from "../PrimaryButton"
import { useState, useEffect } from "react"
import { useForm } from "@inertiajs/react"
import { MdCheckBox, MdDelete } from "react-icons/md"
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { FilePondFile } from 'filepond'
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import SearchableAttibutesSelect from "../SearchableAttributesSelect"
import { Attribute } from "@/types/Attribute"
registerPlugin(FilePondPluginImagePreview);

interface Props {
  variants: Variant[],
  files?: File[],
  onChange: (newVariants: Variant[]) => void
}

export default function ProductVariantForm({ variants, onChange }: Props) {
  const addVariant = () => {
    onChange([
      ...variants,
      {
        id: 0,
        product_id: 0,
        sku: '',
        cost_price: 0,
        price: 0,
        stock_quantity: 0,
        featured: 0,
        image: null,
        images: [],
        attributes: [],
        created_at: '',
        updated_at: '',
      }
    ])
  }

  const { data, post } =
    useForm({
        _method: 'post',
        files: Array<File>(),
    });

  const [files, setFiles] = useState<File[][]>(
    variants.map(() => [])
  );

  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null);
  const [attributeName, setAttributeName] = useState<string | null>(null);

  const handleAddAttribute = (variantIndex: number) => {
    let attributeToAdd = selectedAttribute;
    if (!attributeToAdd) {
      if (attributeName && attributeName.trim() !== '') {
        attributeToAdd = {
          id: 0,
          name: attributeName,
          value: ''
        };
      } else {
        return;
      }
    }
    const updatedVariants = [...variants];
    const variant = updatedVariants[variantIndex];
    if (variant) {
      if (!variant.attributes) variant.attributes = [];
      if (!variant.attributes.some(attr => attr.name === attributeToAdd.name)) {
        variant.attributes.push({ id: 0, name: attributeToAdd.name, value: '' });
      }
    }
    onChange(updatedVariants);
    setSelectedAttribute(null);
    setAttributeName(null);
  };

  useEffect(() => {
    if (files.length !== variants.length) {
      setFiles(variants.map((_, i) => files[i] || []));
    }
  }, [variants.length]);

  const setVariantFiles = (variantIndex: number, newFiles: File[]) => {
    setFiles(prev =>
      prev.map((f, i) => (i === variantIndex ? newFiles : f))
    );
    const updated = [...variants];
    updated[variantIndex].files = newFiles;
    onChange(updated);
  };

  const handleDeleteFile = (fileId: number) => {
    data._method = 'delete';
    post(route('file.destroy', fileId));
  }

  const handleSetFileAsDefault = (fileId: number) => {
    data._method = 'post';
    post(route('file.setAsDefault', fileId));
  }

  const updateVariant = <K extends keyof Variant>(
    index: number,
    field: K,
    value: Variant[K]
  ) => {
    const updated = [...variants]
    updated[index][field] = value
    onChange(updated)
  }

  const updateAttribute = (index: number, key: string, value: string) => {
    const updated = [...variants]
    if (!updated[index].attributes) updated[index].attributes = [];
    const attributeIndex = updated[index].attributes.findIndex(attr => attr.name === key);
    if (attributeIndex !== -1) {
      updated[index].attributes[attributeIndex].value = value;
    } else {
      updated[index].attributes.push({ id: Date.now() + Math.floor(Math.random() * 1000), name: key, value });
    }
    onChange(updated)
  }

  const removeVariant = (index: number) => {
    const updated = [...variants]
    updated.splice(index, 1)
    onChange(updated)
  }

  return (
    <div className="mt-6">
      <h4 className="font-bold text-lg mb-4 text-gray-800">Variantes</h4>
      {variants.map((variant, index) => (
        <div
          key={index}
          className="border border-gray-200 shadow-md p-8 mb-8 rounded-xl bg-white transition hover:shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="flex flex-col">
              <label className="mb-2 text-xs font-semibold text-gray-700">SKU</label>
              <input
                placeholder="SKU"
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                value={variant.sku ?? ''}
                onChange={e => updateVariant(index, 'sku', e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-xs font-semibold text-gray-700">Preço de Custo</label>
              <input
                type="number"
                placeholder="Preço de Custo"
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                value={variant.cost_price ?? ''}
                onChange={e => updateVariant(index, 'cost_price', Number(e.target.value))}
                min={0}
                step="0.01"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-xs font-semibold text-gray-700">Preço</label>
              <input
                type="number"
                placeholder="Preço"
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                value={variant.price ?? ''}
                onChange={e => updateVariant(index, 'price', Number(e.target.value))}
                min={0}
                step="0.01"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-xs font-semibold text-gray-700">Estoque</label>
              <input
                type="number"
                placeholder="Estoque"
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                value={variant.stock_quantity ?? ''}
                onChange={e => updateVariant(index, 'stock_quantity', Number(e.target.value))}
                min={0}
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="mb-2 text-xs font-semibold text-gray-700">Destaque</label>
              <input
                type="checkbox"
                className="w-6 h-6 accent-blue-500"
                checked={!!variant.featured}
                onChange={e => updateVariant(index, 'featured', e.target.checked ? 1 : 0)}
              />
            </div>
          </div>

          {variant.attributes && variant.attributes.length > 0 && (
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-gray-700 mb-3">Atributos</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {variant.attributes.map((attribute, attrIndex) => (
                  <div key={attrIndex} className="flex flex-col">
                    <label className="mb-2 text-xs font-semibold text-gray-700">{attribute.name}</label>
                    <input
                      type="text"
                      placeholder={`Valor de ${attribute.name}`}
                      className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                      value={attribute.value ?? ''}
                      onChange={e => updateAttribute(index, attribute.name, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h5 className="text-sm font-semibold text-gray-700 mb-3">Adicionar Atributo</h5>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Novo Atributo</label>
                <SearchableAttibutesSelect selectedAttribute={selectedAttribute} setAttribute={setSelectedAttribute} setAttributeName={setAttributeName} isDisabled={false} />
              </div>
              <PrimaryButton
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
                onClick={handleAddAttribute.bind(null, index)}
                type="button"
              >
                Adicionar
              </PrimaryButton>
            </div>
          </div>

          <div className="mt-8">
            <label className="block font-semibold text-lg text-gray-700 mb-2">Galeria</label>
            <div className="flex flex-wrap gap-3 mb-6">
              {variant?.images && variant?.images.map((image, imgIndex) => (
                <div key={imgIndex} className="w-28 h-28 bg-gray-100 rounded-lg flex justify-center items-center relative mr-2 shadow">
                  <img src={image?.file_url} alt={image?.name} className="h-28 w-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => handleDeleteFile(image?.id)}
                    className="w-8 h-8 flex justify-center items-center rounded-full hover:text-red-600 text-gray-800 bg-white/80 absolute top-2 right-2 shadow"
                  >
                    <MdDelete />
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex justify-center items-center rounded-full hover:text-blue-600 text-gray-800 bg-white/80 absolute top-2 left-2 shadow"
                    onClick={() => handleSetFileAsDefault(image?.id)}
                  >
                    <MdCheckBox />
                  </button>
                </div>
              ))}
            </div>

            <FilePond
              files={files[index]}
              onupdatefiles={(fileItems: FilePondFile[]) => {
                setVariantFiles(index, fileItems.map(fileItem => fileItem.file) as File[]);
              }}
              allowMultiple={true}
              maxFiles={10}
              labelIdle='Arraste e solte arquivos ou <span class="filepond--label-action">Selecione</span>'
              className="filepond--custom"
            />
          </div>

          <div className="flex justify-end mt-8">
            <PrimaryButton
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow transition"
              onClick={() => removeVariant(index)}
            >
              Remover Variante
            </PrimaryButton>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4 mt-8">
        <PrimaryButton
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg shadow transition"
          onClick={addVariant}
        >
          Adicionar Variante
        </PrimaryButton>
        {variants.length === 0 && (
          <p className="text-gray-400 text-base">Nenhuma variante adicionada.</p>
        )}
      </div>
    </div>
  )
}
