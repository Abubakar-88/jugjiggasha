import React, { useState, useEffect, useRef } from 'react';
import { Calculator, Scale, Coins, Gem, DollarSign, TrendingUp, Info, Eye, EyeOff, RefreshCw, TrendingUp as Up, TrendingDown as Down, Minus } from 'lucide-react';

const ZakatCalculator = () => {
  // State for zakatable assets (Step 1)
  const [assets, setAssets] = useState({
    gold: 0,
    silver: 0,
    cash: 0,
    foreignCurrency: 0,
    bankBalance: 0,
    savingsCertificates: 0,
    insurancePremium: 0,
    providentFund: 0,
    givenLoans: 0,
    creditedMoney: 0,
    depositedMoney: 0,
    securityMoneyRent: 0,
    securityMoneyOther: 0,
    businessCash: 0,
    pendingBusinessPayment: 0,
    businessStock: 0,
    otherBusinessAssets: 0,
    partnershipNetAssets: 0,
    partnershipInvestment: 0,
    sharesCapitalGain: 0,
    sharesDividendNet: 0,
    sharesDividendMarket: 0,
    // Helper fields for calculation
    goldAmount: 0,
    silverAmount: 0
  });

  // State for deductible liabilities (Step 2)
  const [liabilities, setLiabilities] = useState({
    personalLoan: 0,
    businessLoan: 0,
    pendingInstallments: 0,
    unpaidMohr: 0,
    unpaidSalary: 0,
    utilityBills: 0,
    previousZakat: 0
  });

   // Enhanced market prices state with CORRECT prices
  const [marketPrices, setMarketPrices] = useState({
    goldPerTola: 209000, // ২,০৯,০০০ টাকা (22-carat)
    silverPerTola: 4244.20,  // ১,৮০০ টাকা (updated silver price)
    showGoldPrice: true,
    showSilverPrice: true,
    lastUpdated: new Date(),
    isLoading: false,
    previousGoldPrice: 209000,
    previousSilverPrice: 4244.20,
    goldChange: 0,
    silverChange: 0,
    goldChangePercentage: 0,
    silverChangePercentage: 0,
    // Karat prices
    goldPricesByKarat: {
      '22': 209000, // 22-carat
      '21': 200000, // 21-carat  
      '18': 171000  // 18-carat
    }
  });

  const [priceHistory, setPriceHistory] = useState([]);

  // Calculation results
  const [calculation, setCalculation] = useState({
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
    nisab: 0,
    zakatAmount: 0,
    isZakatApplicable: false
  });

  // Nisab thresholds
  const nisab = {
    gold: 7.5,
    silver: 52.5
  };

 

  const addToPriceHistory = (goldPrice, silverPrice) => {
    const newEntry = {
      timestamp: new Date(),
      gold: goldPrice,
      silver: silverPrice
    };

    setPriceHistory(prev => [newEntry, ...prev.slice(0, 4)]);
  };

  // Auto-fetch prices
  useEffect(() => {
    fetchMarketPrices();
    
    const interval = setInterval(fetchMarketPrices, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate zakat
  useEffect(() => {
    calculateZakat();
  }, [assets, liabilities, marketPrices]);

  const calculateZakat = () => {
    const totalAssets = Object.values(assets).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
    const totalLiabilities = Object.values(liabilities).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);

    const netWorth = totalAssets - totalLiabilities;
    const nisabValue = nisab.silver * marketPrices.silverPerTola;

    const isZakatApplicable = netWorth >= nisabValue;
    const zakatAmount = isZakatApplicable ? netWorth * 0.025 : 0;

    setCalculation({
      totalAssets,
      totalLiabilities,
      netWorth,
      nisab: nisabValue,
      zakatAmount,
      isZakatApplicable
    });
  };
// Calculate gold value based on karat
  const calculateGoldValue = (amount, karat) => {
    const pricePerTola = marketPrices.goldPricesByKarat[karat] || marketPrices.goldPricesByKarat['22'];
    return amount * pricePerTola;
  };

  // Enhanced price fetching with realistic changes
  const fetchMarketPrices = async () => {
    setMarketPrices(prev => ({ ...prev, isLoading: true }));
    
    try {
      const currentGold = marketPrices.goldPerTola;
      const currentSilver = marketPrices.silverPerTola;
      
      // Simulate realistic gold price changes (±1%)
      const goldChangePercent = (Math.random() * 2 - 1) / 100; // -1% to +1%
      const silverChangePercent = (Math.random() * 2 - 1) / 100;
      
      const newGoldPrice = Math.floor(currentGold * (1 + goldChangePercent));
      const newSilverPrice = Math.floor(currentSilver * (1 + silverChangePercent));

      // Calculate changes
      const goldChange = newGoldPrice - currentGold;
      const silverChange = newSilverPrice - currentSilver;
      const goldChangePercentage = ((goldChange / currentGold) * 100);
      const silverChangePercentage = ((silverChange / currentSilver) * 100);

      // Update all karat prices proportionally
      const newGoldPricesByKarat = {};
      Object.keys(marketPrices.goldPricesByKarat).forEach(karat => {
        const currentPrice = marketPrices.goldPricesByKarat[karat];
        newGoldPricesByKarat[karat] = Math.floor(currentPrice * (1 + goldChangePercent));
      });

      await new Promise(resolve => setTimeout(resolve, 800));

      setMarketPrices(prev => ({
        ...prev,
        goldPerTola: newGoldPrice,
        silverPerTola: newSilverPrice,
        goldPricesByKarat: newGoldPricesByKarat,
        previousGoldPrice: currentGold,
        previousSilverPrice: currentSilver,
        goldChange: goldChange,
        silverChange: silverChange,
        goldChangePercentage: goldChangePercentage,
        silverChangePercentage: silverChangePercentage,
        lastUpdated: new Date(),
        isLoading: false
      }));

      addToPriceHistory(newGoldPrice, newSilverPrice);

    } catch (error) {
      console.error('Price fetch error:', error);
      setMarketPrices(prev => ({ ...prev, isLoading: false }));
    }
  };
  const handleAssetChange = (field, value) => {
    setAssets(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };
  // Handle gold karat change
  const handleGoldKaratChange = (karat) => {
    const newGoldPrice = marketPrices.goldPricesByKarat[karat];
    setAssets(prev => ({
      ...prev,
      goldKarat: karat,
      gold: prev.goldAmount * newGoldPrice
    }));
  };
  // Update gold value when amount or karat changes
  useEffect(() => {
    if (assets.goldAmount > 0) {
      const value = calculateGoldValue(assets.goldAmount, assets.goldKarat);
      setAssets(prev => ({ ...prev, gold: value }));
    }
  }, [assets.goldAmount, assets.goldKarat, marketPrices.goldPricesByKarat]);
  const handleLiabilityChange = (field, value) => {
    setLiabilities(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const togglePriceVisibility = (field) => {
    setMarketPrices(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const resetCalculator = () => {
    setAssets({
      gold: 0, silver: 0, cash: 0, foreignCurrency: 0, bankBalance: 0,
      savingsCertificates: 0, insurancePremium: 0, providentFund: 0,
      givenLoans: 0, depositedMoney: 0, securityMoneyRent: 0,
      securityMoneyOther: 0, businessCash: 0, pendingBusinessPayment: 0,
      businessStock: 0, otherBusinessAssets: 0, partnershipNetAssets: 0,
      partnershipInvestment: 0, sharesCapitalGain: 0, sharesDividendNet: 0,
      sharesDividendMarket: 0, goldAmount: 0, silverAmount: 0
    });
    setLiabilities({
      personalLoan: 0, businessLoan: 0, pendingInstallments: 0,
      unpaidMohr: 0, unpaidSalary: 0, utilityBills: 0, previousZakat: 0
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('bn-BD', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  // 🔥 Price change indicator component
  const PriceChangeIndicator = ({ change, percentage, type }) => {
    if (change === 0) return (
      <div className="flex items-center text-gray-500 text-sm">
        <Minus className="h-4 w-4 mr-1" />
        <span>অপরিবর্তিত</span>
      </div>
    );

    const isPositive = change > 0;
    
    return (
      <div className={`flex items-center text-sm ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {isPositive ? (
          <Up className="h-4 w-4 mr-1" />
        ) : (
          <Down className="h-4 w-4 mr-1" />
        )}
        <span>
          {isPositive ? 'বৃদ্ধি' : 'হ্রাস'} | 
          ৳{Math.abs(change).toLocaleString('bn-BD')} 
          ({Math.abs(percentage).toFixed(2)}%)
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <Calculator className="h-12 w-12 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 bangla-text">
              যাকাত ক্যালকুলেটর
            </h1>
          </div>
          <p className="text-lg text-gray-600 bangla-text max-w-2xl mx-auto">
            ইসলামী বিধান অনুযায়ী আপনার সম্পদের সঠিক যাকাত হিসাব করুন
          </p>
        </div>

        {/* Enhanced Market Prices Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 bangla-text">
              বর্তমান বাজার মূল্য ও পরিবর্তন
            </h2>
            <button
              onClick={fetchMarketPrices}
              disabled={marketPrices.isLoading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${marketPrices.isLoading ? 'animate-spin' : ''}`} />
              <span className="bangla-text">
                {marketPrices.isLoading ? 'আপডেট হচ্ছে...' : 'মূল্য আপডেট করুন'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Gold Price */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm font-medium text-gray-700 bangla-text">
                  <Gem className="h-5 w-5 text-yellow-600 mr-2" />
                  সোনা (প্রতি তোলা)
                </label>
                <button
                  onClick={() => togglePriceVisibility('showGoldPrice')}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {marketPrices.showGoldPrice ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
           <div className="bg-gray-50 p-4 rounded-lg border">
                {marketPrices.showGoldPrice ? (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-2">
                      ৳{formatCurrency(marketPrices.goldPerTola)}
                    </div>
                    <div className="text-sm text-gray-600 bangla-text mb-2">
                      (২২ ক্যারেট সোনা)
                    </div>
                    <PriceChangeIndicator 
                      change={marketPrices.goldChange}
                      percentage={marketPrices.goldChangePercentage}
                      type="gold"
                    />
                    <div className="text-sm text-gray-600 bangla-text mt-2">
                      প্রতি ভরি/তোলা
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 bangla-text">
                    দাম লুকানো আছে
                  </div>
                )}
              </div>

              {/* Gold Calculation Helper with Karat Selection */}
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <label className="block text-sm font-medium text-yellow-800 bangla-text mb-2">
                  আপনার সোনার মূল্য হিসাব করুন
                </label>
                
                {/* Karat Selection */}
                <div className="mb-3">
                  <label className="block text-xs text-yellow-700 bangla-text mb-1">
                    সোনার ক্যারেট নির্বাচন করুন:
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { value: '22', label: '২২ ক্যারেট', price: marketPrices.goldPricesByKarat['22'] },
                      { value: '21', label: '২১ ক্যারেট', price: marketPrices.goldPricesByKarat['21'] },
                      { value: '18', label: '১৮ ক্যারেট', price: marketPrices.goldPricesByKarat['18'] }
                    ].map(karat => (
                      <button
                        key={karat.value}
                        onClick={() => handleGoldKaratChange(karat.value)}
                        className={`p-2 text-xs rounded border ${
                          assets.goldKarat === karat.value 
                            ? 'bg-yellow-500 text-white border-yellow-600' 
                            : 'bg-white text-yellow-700 border-yellow-300'
                        }`}
                      >
                        <div>{karat.label}</div>
                        <div className="font-semibold">৳{formatCurrency(karat.price)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-yellow-700 bangla-text">সোনার পরিমাণ (ভরি):</span>
                    <input
                      type="number"
                      step="0.01"
                      value={assets.goldAmount || ''}
                      onChange={(e) => {
                        const amount = parseFloat(e.target.value) || 0;
                        setAssets(prev => ({ ...prev, goldAmount: amount }));
                      }}
                      placeholder="ভরি"
                      className="w-20 px-2 py-1 border border-yellow-300 rounded text-sm"
                    />
                  </div>
                  <div className="text-xs text-yellow-600 bangla-text">
                    বর্তমান মূল্য: ৳{formatCurrency(assets.gold)}
                  </div>
                  <div className="text-xs text-yellow-500">
                    নির্বাচিত: {assets.goldKarat} ক্যারেট
                  </div>
                </div>
              </div>

              {/* Nisab Information */}
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 bangla-text text-sm mb-2">
                  নিসাব তথ্য (সোনা)
                </h4>
                <div className="text-xs text-green-700 space-y-1">
                  <div>নিসাব পরিমাণ: ৭.৫ ভরি সোনা</div>
                  <div>নিসাব মূল্য: ৳{formatCurrency(7.5 * marketPrices.goldPricesByKarat['22'])}</div>
                  <div>(৭.৫ ভরি × ৳{formatCurrency(marketPrices.goldPricesByKarat['22'])})</div>
                </div>
              </div>
            </div>

          {/* Silver Price - Similar structure */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm font-medium text-gray-700 bangla-text">
                  <Coins className="h-5 w-5 text-gray-400 mr-2" />
                  রূপা (প্রতি ভরি/তোলা)
                </label>
                <button
                  onClick={() => togglePriceVisibility('showSilverPrice')}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {marketPrices.showSilverPrice ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border">
                {marketPrices.showSilverPrice ? (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600 mb-2">
                      ৳{formatCurrency(marketPrices.silverPerTola)}
                    </div>
                    <PriceChangeIndicator 
                      change={marketPrices.silverChange}
                      percentage={marketPrices.silverChangePercentage}
                      type="silver"
                    />
                    <div className="text-sm text-gray-600 bangla-text mt-2">
                      প্রতি ভরি/তোলা
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 bangla-text">
                    দাম লুকানো আছে
                  </div>
                )}
              </div>

              {/* Silver Calculation Helper */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <label className="block text-sm font-medium text-blue-800 bangla-text mb-2">
                  আপনার রূপার মূল্য হিসাব করুন
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700 bangla-text">রূপার পরিমাণ (ভরি):</span>
                    <input
                      type="number"
                      step="0.01"
                      value={assets.silverAmount || ''}
                      onChange={(e) => {
                        const amount = parseFloat(e.target.value) || 0;
                        const value = amount * marketPrices.silverPerTola;
                        setAssets(prev => ({
                          ...prev,
                          silverAmount: amount,
                          silver: value
                        }));
                      }}
                      placeholder="ভরি"
                      className="w-20 px-2 py-1 border border-blue-300 rounded text-sm"
                    />
                  </div>
                  <div className="text-xs text-blue-600 bangla-text">
                    বর্তমান মূল্য: ৳{formatCurrency(assets.silver)}
                  </div>
                </div>
              </div>

              {/* Silver Nisab Information */}
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 bangla-text text-sm mb-2">
                  নিসাব তথ্য (রূপা)
                </h4>
                <div className="text-xs text-purple-700 space-y-1">
                  <div>নিসাব পরিমাণ: ৫২.৫ ভরি রূপা</div>
                  <div>নিসাব মূল্য: ৳{formatCurrency(52.5 * marketPrices.silverPerTola)}</div>
                  <div>(৫২.৫ ভরি × ৳{formatCurrency(marketPrices.silverPerTola)})</div>
                </div>
              </div>
            </div>
          </div>

          {/* Price History */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 bangla-text">
              মূল্য পরিবর্তনের ইতিহাস
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-yellow-700 bangla-text mb-2">সোনার মূল্য প্রবণতা</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {priceHistory.slice(0, 5).map((entry, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{formatTime(entry.timestamp)}</span>
                      <span className="font-medium">৳{formatCurrency(entry.gold)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-600 bangla-text mb-2">রূপার মূল্য প্রবণতা</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {priceHistory.slice(0, 5).map((entry, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{formatTime(entry.timestamp)}</span>
                      <span className="font-medium">৳{formatCurrency(entry.silver)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="text-sm text-gray-500 bangla-text">
              সর্বশেষ আপডেট: {formatTime(marketPrices.lastUpdated)}
            </div>
            <div className="text-xs text-gray-400 bangla-text">
              দাম স্বয়ংক্রিয়ভাবে প্রতি ২ মিনিটে আপডেট হয়
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step 1: Zakatable Assets */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center mb-6">
                <Scale className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-2xl font-semibold text-gray-800 bangla-text">
                  ধাপ ১: যাকাতযোগ্য সম্পদ
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AssetInput
                  number="৩"
                  label="নিজের কাছে রাখা নগদ অর্থ (সেটা যে উদ্দেশ্যেই রাখা হোক না কেন, যেমন: হজ, বিবাহ, গৃহ-নির্মাণ ইত্যাদি)"
                  value={assets.cash}
                  onChange={(value) => handleAssetChange('cash', value)}
                />

                <AssetInput
                  number="৪"
                  label="বৈদেশিক মুদ্রার বিক্রয় মূল্য"
                  value={assets.foreignCurrency}
                  onChange={(value) => handleAssetChange('foreignCurrency', value)}
                />

                <AssetInput
                  number="৫"
                  label="ব্যাংক একাউন্টে জমাকৃত অর্থ"
                  value={assets.bankBalance}
                  onChange={(value) => handleAssetChange('bankBalance', value)}
                />

                <AssetInput
                  number="৬"
                  label="সঞ্চয়পত্র, বন্ড, ডিবেঞ্চার ইত্যাদি"
                  value={assets.savingsCertificates}
                  onChange={(value) => handleAssetChange('savingsCertificates', value)}
                />

                <AssetInput
                  number="৭"
                  label="বীমা পলিসিতে জমাকৃত প্রিমিয়াম"
                  value={assets.insurancePremium}
                  onChange={(value) => handleAssetChange('insurancePremium', value)}
                />

                <AssetInput
                  number="৮"
                  label="প্রভিডেন্ট ফান্ডে জমানো অর্থ (বাধ্যতামূলক অংশ বাদ দিয়ে)"
                  value={assets.providentFund}
                  onChange={(value) => handleAssetChange('providentFund', value)}
                />
                 <AssetInput
                  number="৯"
                  label=" প্রদত্ত ঋণের সম্পূর্ণ অর্থ, যা পাওয়ার আশা রয়েছে (ঋণগ্রহীতা তা স্বীকার করে ও আদায়ের ওয়াদা দিয়েছে কিংবা ঋণদাতার নিকট এমন প্রমাণ আছে যা দ্বারা বিচার-সালিশের মাধ্যমে পাওনা উসূল করা যাবে)"
                  value={assets.givenLoans}
                  onChange={(value) => handleAssetChange('givenLoans', value)}
                />
                <AssetInput
                  number="১০"
                  label="  আমানত হিসেবে কারো কাছে রাখা টাকা"
                  value={assets.givenLoans}
                  onChange={(value) => handleAssetChange('givenLoans', value)}
                />
              </div>
            </div>

            {/* Step 2: Deductible Liabilities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <Calculator className="h-6 w-6 text-red-600 mr-2" />
                <h2 className="text-2xl font-semibold text-gray-800 bangla-text">
                  ধাপ ২: যাকাত থেকে বিয়োগযোগ্য সম্পদ
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AssetInput
                  number="২২"
                  label="ব্যক্তিগত ঋণের পরিমাণ"
                  value={liabilities.personalLoan}
                  onChange={(value) => handleLiabilityChange('personalLoan', value)}
                />

                <AssetInput
                  number="২৩"
                  label="ব্যবসিক ঋণ"
                  value={liabilities.businessLoan}
                  onChange={(value) => handleLiabilityChange('businessLoan', value)}
                />

                <AssetInput
                  number="২৪"
                  label="কিস্তিতে ক্রয়কৃত পণ্যের অপরিশোধিত মূল্য"
                  value={liabilities.pendingInstallments}
                  onChange={(value) => handleLiabilityChange('pendingInstallments', value)}
                />

                <AssetInput
                  number="২৫"
                  label="স্ত্রীর অনাদায়ী মোহর"
                  value={liabilities.unpaidMohr}
                  onChange={(value) => handleLiabilityChange('unpaidMohr', value)}
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6 bangla-text border-b pb-3">
                যাকাত হিসাব
              </h2>

              <div className="space-y-4">
                <ResultItem
                  label="মোট যাকাতযোগ্য সম্পদ"
                  value={`৳ ${formatCurrency(calculation.totalAssets)}`}
                  color="text-green-600"
                />

                <ResultItem
                  label="মোট বিয়োগযোগ্য দেনা"
                  value={`৳ ${formatCurrency(calculation.totalLiabilities)}`}
                  color="text-red-600"
                />

                <ResultItem
                  label="নিট সম্পদ"
                  value={`৳ ${formatCurrency(calculation.netWorth)}`}
                  color="text-blue-600"
                />

                <ResultItem
                  label="নিসাব পরিমাণ"
                  value={`৳ ${formatCurrency(calculation.nisab)}`}
                  color="text-purple-600"
                />

                <div className={`p-4 rounded-lg ${
                  calculation.isZakatApplicable ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="text-center">
                    <div className="text-lg font-semibold bangla-text mb-2">
                      {calculation.isZakatApplicable ? '✅ যাকাত প্রদানযোগ্য' : '❌ যাকাত প্রদানযোগ্য নয়'}
                    </div>
                    {calculation.isZakatApplicable && (
                      <div className="text-2xl font-bold text-green-700 bangla-text">
                        ৳ {formatCurrency(calculation.zakatAmount)}
                      </div>
                    )}
                    <div className="text-sm text-gray-600 bangla-text mt-2">
                      {calculation.isZakatApplicable 
                        ? 'আপনার মোট যাকাতের পরিমাণ' 
                        : 'আপনার সম্পদ নিসাব পরিমাণের নিচে'
                      }
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={resetCalculator}
                  className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 bangla-text font-semibold"
                >
                  রিসেট করুন
                </button>
                {calculation.isZakatApplicable && (
                  <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 bangla-text font-semibold">
                    যাকাত প্রদান করুন
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const AssetInput = ({ number, label, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 bangla-text">
      {number}। {label}
    </label>
    <div className="relative">
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="টাকার পরিমাণ"
        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bangla-text"
      />
      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        ৳
      </span>
    </div>
  </div>
);

const ResultItem = ({ label, value, color }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-200">
    <span className="text-gray-600 bangla-text text-sm">{label}</span>
    <span className={`font-semibold ${color} text-sm`}>{value}</span>
  </div>
);

export default ZakatCalculator;