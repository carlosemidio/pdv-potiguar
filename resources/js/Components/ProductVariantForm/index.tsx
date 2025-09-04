import { Variant } from "@/types/Variant"
import PrimaryButton from "../PrimaryButton"
import { useState } from "react"
import { useForm } from "@inertiajs/react"
import { MdCheckBox, MdDelete } from "react-icons/md"
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { FilePondFile } from 'filepond'
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useEffect } from "react";
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
        price: 0,
        stock_quantity: 0,
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

  // Manage files per variant
  const [files, setFiles] = useState<File[][]>(
    variants.map(() => [])
  );

  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null);
  const [attributeName, setAttributeName] = useState<string | null>(null);

  // Add attribute only to the selected variant (by index)
  const handleAddAttribute = (variantIndex: number) => {

    let attributeToAdd = selectedAttribute;
    if (!attributeToAdd) {
      if (attributeName && attributeName.trim() !== '') {
        // If no attribute is selected, use the provided name
        attributeToAdd = {
          id: 0, // Generate a unique ID
          name: attributeName,
          value: ''
        };
      } else {
        // If no attribute is selected and no name provided, do nothing
        return;
      }
    }

    const updatedVariants = [...variants];
    const variant = updatedVariants[variantIndex];

    if (variant) {
      if (!variant.attributes) {
        variant.attributes = [];
      }
      // If attribute already exists, do nothing
      if (!variant.attributes.some(attr => attr.name === attributeToAdd.name)) {
        variant.attributes.push({ id: 0, name: attributeToAdd.name, value: '' });
      }
    }

    onChange(updatedVariants);
    setSelectedAttribute(null); // Reset selected attribute after adding
  };

  // Sync files state when variants change (add/remove)
  // Add/remove file arrays as needed
  // This effect ensures files array matches variants length
  // (does not handle reordering)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // Sync files state when variants change (add/remove)
  useEffect(() => {
    if (files.length !== variants.length) {
      setFiles(variants.map((_, i) => files[i] || []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants.length]);

  // Helper to update files for a specific variant
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

    if (!updated[index].attributes) {
      updated[index].attributes = [];
    }

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
          className="border border-gray-200 shadow-sm p-6 mb-5 rounded-lg bg-white transition hover:shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-gray-600">SKU</label>
              <input
                placeholder="SKU"
                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                value={variant.sku ?? ''}
                onChange={e => updateVariant(index, 'sku', e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-gray-600">Preço</label>
              <input
                type="number"
                placeholder="Preço"
                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                value={variant.price ?? ''}
                onChange={e => updateVariant(index, 'price', Number(e.target.value))}
                min={0}
                step="0.01"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-gray-600">Estoque</label>
              <input
                type="number"
                placeholder="Estoque"
                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                value={variant.stock_quantity ?? ''}
                onChange={e => updateVariant(index, 'stock_quantity', Number(e.target.value))}
                min={0}
              />
            </div>
          </div>

          {variant.attributes && variant.attributes.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Atributos</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {variant.attributes.map((attribute, attrIndex) => (
                  <div key={attrIndex} className="flex flex-col">
                    <label className="mb-1 text-xs font-medium text-gray-600">{attribute.name}</label>
                    <input
                      type="text"
                      placeholder={`Valor de ${attribute.name}`}
                      className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                      value={attribute.value ?? ''}
                      onChange={e => updateAttribute(index, attribute.name, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add attribute */}
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Adicionar Atributo</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex gap-4 items-end mb-8">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Novo Atributo</label>
                  <SearchableAttibutesSelect selectedAttribute={selectedAttribute} setAttribute={setSelectedAttribute} setAttributeName={setAttributeName} isDisabled={false} />
                </div>
                <PrimaryButton
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  onClick={handleAddAttribute.bind(null, index)}
                  type="button"
                >
                  Adicionar Atributo
                </PrimaryButton>
              </div>
            </div>
          </div>

          <div className="w-full col-span-1 md:col-span-2 lg:col-span-3">
            <label className="block font-medium text-xl text-gray-700 mt-10">Imagem principal (Card da listagem)</label>
            <div className="flex flex-wrap gap-2">
                {variant?.image && (
                    <div className="w-1/4 h-24 bg-gray-200 rounded-lg flex justify-center items-center relative mr-2">
                        <img src={variant?.image?.file_url} alt={variant?.image?.name} className="h-24 w-full object-cover rounded-lg" />
                        <span
                            onClick={() => {
                                if (variant?.image?.id !== undefined) {
                                    handleDeleteFile(variant.image.id);
                                }
                            }}
                            className="w-9 h-9 transition-all duration-200 flex justify-center items-center rounded-bl-2xl hover:text-red-600 text-gray-800 bg-slate-300/50 absolute top-0 right-0">
                            <MdDelete />
                        </span>
                    </div>
                )}
            </div>

            <label className="block font-medium text-xl text-gray-700 mt-10">Galeria</label>
            <div className="flex flex-wrap gap-2 mb-10">
                {variant?.images && variant?.images.map((image, index) => (
                    <div key={index} className="w-1/4 h-24 bg-gray-200 rounded-lg flex justify-center items-center relative mr-2">
                        <img src={image?.file_url} alt={image?.name} className="h-24 w-full object-cover rounded-lg" />
                        <span
                            onClick={() => handleDeleteFile(image?.id)}
                            className="w-9 h-9 transition-all duration-200 flex justify-center items-center rounded-bl-2xl hover:text-red-600 text-gray-800 bg-slate-300/50 absolute top-0 right-0">
                            <MdDelete />
                        </span>

                        <span className="w-9 h-9 transition-all duration-200 flex justify-center items-center rounded-bl-2xl hover:text-red-600 text-gray-800 bg-slate-300/50 absolute top-0 left-0"
                            onClick={() => handleSetFileAsDefault(image?.id)}>
                            <MdCheckBox />
                        </span>
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
            />
          </div>

          <div className="flex justify-end mt-4">
            <PrimaryButton
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-sm transition"
              onClick={() => removeVariant(index)}
            >
              Remover Variante
            </PrimaryButton>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4 mt-6">
        <PrimaryButton
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow-sm transition"
          onClick={addVariant}
        >
          Adicionar Variante
        </PrimaryButton>
        {variants.length === 0 && (
          <p className="text-gray-400 text-sm">Nenhuma variante adicionada.</p>
        )}
      </div>
    </div>
  )
}