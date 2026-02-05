import React, { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Package } from "lucide-react";
import { useI18n } from "../i18n";

interface Supplier {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  distance: string;
  products: string[];
}

export default function Suppliers() {
  const { t } = useI18n();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  // Reset scroll position and fetch suppliers data when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Fetch suppliers data from JSON file
    fetch('/data/suppliers-data.json')
      .then(response => response.json())
      .then(data => {
        setSuppliers(data.suppliers);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading suppliers data:', error);
        setLoading(false);
      });
  }, []);

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, "_self");
  };

  const handleDirections = (address: string) => {
    const query = encodeURIComponent(address);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <div className="bg-primary-500 text-white px-4 pt-12 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {t("localSuppliers")}
        </h1>
        <p className="text-primary-100 text-sm sm:text-base">
          {t("findSuppliersSub")}
        </p>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Info Banner */}
        <div className="bg-primary-100 text-primary-500 p-4 rounded-lg flex items-center gap-3">
          <Package size={24} />
          <p className="font-medium">{t("certifiedSuppliers")}</p>
        </div>

        {/* Suppliers List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">{t("loading")}</p>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="card text-center">
              <p className="text-gray-600">{t("noSuppliersFound")}</p>
            </div>
          ) : (
            suppliers.map((supplier) => (
            <div key={supplier.id} className="card">
              {/* Supplier Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-primary-500 flex-1 mr-3">
                  {supplier.name}
                </h3>
                <div className="bg-primary-100 text-primary-500 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{supplier.distance}</span>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 mb-4">
                <MapPin
                  size={18}
                  className="text-gray-500 mt-0.5 flex-shrink-0"
                />
                <p className="text-gray-600 text-sm">{supplier.address}</p>
              </div>

              {/* Products */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-primary-500 mb-2">
                  {t("products")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {supplier.products.map((product, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {t(`product${product.replace(/\s+/g, "")}`)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleCall(supplier.phone)}
                  className="btn-primary text-sm py-2"
                >
                  <Phone size={16} />
                  {t("call")}
                </button>
                <button
                  onClick={() => handleEmail(supplier.email)}
                  className="btn-secondary text-sm py-2"
                >
                  <Mail size={16} />
                  {t("email")}
                </button>
                <button
                  onClick={() => handleDirections(supplier.address)}
                  className="btn-secondary text-sm py-2"
                >
                  <MapPin size={16} />
                  {t("directions")}
                </button>
              </div>
            </div>
            ))
          )}
        </div>

        {/* Bottom Info */}
        <div className="card text-center">
          <h3 className="font-bold text-primary-500 mb-2">
            {t("missingSupplier")}
          </h3>
          <p className="text-gray-600 text-sm">{t("contactUsAdd")}</p>
        </div>
      </div>
    </div>
  );
}
