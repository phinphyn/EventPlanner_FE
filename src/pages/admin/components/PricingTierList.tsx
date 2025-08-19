import React, { useState } from 'react';

interface PricingTier {
  name: string;
  price: number;
  description?: string;
  isActive?: boolean;
}

interface PricingTierListProps {
  onAdd: (tiers: PricingTier[]) => void;
}

const PricingTierList: React.FC<PricingTierListProps> = ({ onAdd }) => {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [formData, setFormData] = useState<PricingTier>({
    name: '',
    price: 0,
    description: '',
    isActive: true,
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleAddTier = (e: React.FormEvent) => {
    e.preventDefault();
    setTiers((prev) => [...prev, formData]);
    setFormData({ name: '', price: 0, description: '', isActive: true });
  };

  const handleRemoveTier = (idx: number) => {
    setTiers((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    onAdd(tiers);
  };

  return (
    <div className="border rounded p-2 mb-2">
      <h4 className="font-bold mb-2">Bảng giá</h4>
      {tiers.map((tier, idx) => (
        <div key={idx} className="flex items-center gap-2 mb-1">
          <span>
            {tier.name} - {tier.price}đ
          </span>
          <button
            type="button"
            className="btn btn-danger btn-xs"
            onClick={() => handleRemoveTier(idx)}
          >
            Xóa
          </button>
        </div>
      ))}
      <form onSubmit={handleAddTier} className="flex gap-2 mb-2">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleFormChange}
          placeholder="Tên bảng giá"
          className="input input-bordered"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleFormChange}
          placeholder="Giá"
          className="input input-bordered"
          required
          min={0}
        />
        <input
          type="text"
          name="description"
          value={formData.description || ''}
          onChange={handleFormChange}
          placeholder="Mô tả"
          className="input input-bordered"
        />
        <button type="submit" className="btn btn-primary">
          Thêm
        </button>
      </form>
      <button type="button" className="btn btn-success" onClick={handleSave}>
        Lưu bảng giá
      </button>
    </div>
  );
};

export default PricingTierList;
