import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import type {
  PricingTier,
  ServiceInVariant,
  ServiceVariant,
} from '@/services/eventVariantService';

interface VariantShowingStepProps {
  variants: ServiceVariant[];
  selectedVariants?: number[];
  onVariantSelect?: (variantId: number) => void;
  onVariantDeselect?: (variantId: number) => void;
  multiSelect?: boolean;
  loading?: boolean;
}

const VariantShowingStep: React.FC<VariantShowingStepProps> = ({
  variants = [],
  selectedVariants = [],
  onVariantSelect,
  onVariantDeselect,
  // multiSelect = false,
  loading = false,
}) => {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Number.parseInt(price));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const calculateTierPrice = (basePrice: string, modifier: string) => {
    const base = Number.parseInt(basePrice);
    const mod = Number.parseFloat(modifier);
    const newPrice = base + (base * mod) / 100;
    return newPrice.toString();
  };

  const handleVariantClick = (variantId: number) => {
    const isSelected = selectedVariants.includes(variantId);

    if (isSelected) {
      onVariantDeselect?.(variantId);
    } else {
      onVariantSelect?.(variantId);
    }
  };

  const getActivePricingTiers = (tiers: PricingTier[]) => {
    const now = new Date();
    return tiers.filter((tier) => {
      const validFrom = new Date(tier.valid_from);
      const validTo = new Date(tier.valid_to);
      return tier.is_active && now >= validFrom && now <= validTo;
    });
  };

  // Group variants by service
  const groupedVariants = variants.reduce((acc, variant) => {
    const serviceId = variant.service.service_id;
    if (!acc[serviceId]) {
      acc[serviceId] = {
        service: variant.service,
        variants: [],
      };
    }
    acc[serviceId].variants.push(variant);
    return acc;
  }, {} as Record<number, { service: ServiceInVariant; variants: ServiceVariant[] }>);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Chọn gói dịch vụ
          </h2>
          <p className="text-gray-600">Đang tải...</p>
        </div>
        {[1, 2].map((serviceIndex) => (
          <div key={serviceIndex} className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Chọn gói dịch vụ
        </h2>
        <p className="text-gray-600">
          Chọn gói dịch vụ phù hợp với nhu cầu của bạn
        </p>
      </div>

      {Object.values(groupedVariants).map(
        ({ service, variants: serviceVariants }) => (
          <div key={service.service_id} className="space-y-4">
            {/* Service Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {service.service_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {serviceVariants.length} gói có sẵn
                    {serviceVariants.filter((v) =>
                      selectedVariants.includes(v.variation_id),
                    ).length > 0 && (
                      <span className="ml-2 text-blue-600 font-medium">
                        •{' '}
                        {
                          serviceVariants.filter((v) =>
                            selectedVariants.includes(v.variation_id),
                          ).length
                        }{' '}
                        đã chọn
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {service.is_available && service.is_active ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Có sẵn
                  </Badge>
                ) : (
                  <Badge variant="secondary">Không khả dụng</Badge>
                )}
              </div>
            </div>

            {/* Variants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
              {serviceVariants.map((variant) => {
                const isSelected = selectedVariants.includes(
                  variant.variation_id,
                );

                const activeTiers = getActivePricingTiers(
                  variant.pricing_tiers,
                );
                const isVariantAvailable =
                  variant.is_active &&
                  service.is_available &&
                  service.is_active;

                return (
                  <Card
                    key={variant.variation_id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg relative ${
                      isSelected
                        ? 'ring-2 ring-blue-500 shadow-lg'
                        : 'hover:shadow-md'
                    } ${!isVariantAvailable ? 'opacity-60' : ''}`}
                    onClick={() =>
                      isVariantAvailable &&
                      handleVariantClick(variant.variation_id)
                    }
                  >
                    {/* Service indicator line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg"></div>

                    <div className="relative">
                      <img
                        src={variant.transformedImageUrl || '/placeholder.svg'}
                        alt={variant.variation_name}
                        className="w-full h-40 object-cover rounded-t-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/abstract-service-variants.png';
                        }}
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-blue-500 text-white shadow-lg">
                            Đã chọn
                          </Badge>
                        </div>
                      )}
                      {!isVariantAvailable && (
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-t-lg flex items-center justify-center">
                          <Badge
                            variant="secondary"
                            className="bg-white text-gray-700"
                          >
                            Không khả dụng
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardHeader className="pb-2">
                      <h4 className="font-semibold text-base text-gray-900 line-clamp-2">
                        {variant.variation_name}
                      </h4>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Base Price and Duration */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{variant.duration_hours} giờ</span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {formatPrice(variant.base_price)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Giá cơ bản
                            </div>
                          </div>
                        </div>

                        {/* Active Pricing Tiers */}
                        {activeTiers.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-gray-700">
                              Ưu đãi hiện tại:
                            </div>
                            {activeTiers.slice(0, 2).map((tier) => {
                              const modifier = Number.parseFloat(
                                tier.price_modifier,
                              );
                              const newPrice = calculateTierPrice(
                                variant.base_price,
                                tier.price_modifier,
                              );

                              return (
                                <div
                                  key={tier.tier_id}
                                  className="bg-green-50 border border-green-200 rounded-md p-2"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1">
                                      {modifier > 0 ? (
                                        <TrendingUp className="w-3 h-3 text-red-500" />
                                      ) : (
                                        <TrendingDown className="w-3 h-3 text-green-500" />
                                      )}
                                      <span
                                        className={`text-xs font-medium ${
                                          modifier > 0
                                            ? 'text-red-600'
                                            : 'text-green-600'
                                        }`}
                                      >
                                        {modifier > 0 ? '+' : ''}
                                        {modifier}%
                                      </span>
                                    </div>
                                    <div className="text-xs font-bold text-gray-900">
                                      {formatPrice(newPrice)}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                      {formatDate(tier.valid_from)} -{' '}
                                      {formatDate(tier.valid_to)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Selection Button */}
                        <Button
                          variant={isSelected ? 'default' : 'outline'}
                          className="w-full"
                          disabled={!isVariantAvailable}
                          size="sm"
                        >
                          {isSelected ? 'Đã chọn' : 'Chọn gói này'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ),
      )}

      {Object.keys(groupedVariants).length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">Không có gói dịch vụ nào</div>
          <p className="text-sm text-gray-400">
            Vui lòng quay lại bước trước để chọn dịch vụ khác
          </p>
        </div>
      )}
    </div>
  );
};

export default VariantShowingStep;
