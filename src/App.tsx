import { useState } from 'react';
import {
  ChevronLeft,
  Check,
  Home,
  DollarSign,
  User,
  Briefcase,
  Lock,
  ArrowRight,
  ShieldCheck,
  Building,
  Clock,
  MousePointerClick,
  Target,
  Zap
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FormData {
  loanPurpose: string;
  propertyState: string;
  estimatedPrice: string;
  creditScore: string;
  employmentStatus: string;
  annualIncome: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface FormErrors {
  [key: string]: string | null;
}

const formatCurrency = (value: string): string => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const formatPhoneNumber = (value: string): string => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  const effectiveStep = currentStep - 1;
  const effectiveTotal = totalSteps - 1;
  const progress = (effectiveStep / (effectiveTotal - 1)) * 100;

  return (
    <div className="w-full h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
      <div
        className="h-full bg-blue-900 transition-all duration-500 ease-in-out"
        style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
      />
    </div>
  );
};

const InputGroup = ({
  label,
  icon: Icon,
  error,
  children
}: {
  label: string;
  icon: LucideIcon;
  error?: string | null;
  children: React.ReactNode;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    <div className={`relative flex items-center group transition-all duration-200`}>
      <div className="absolute left-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
        <Icon size={18} />
      </div>
      {children}
    </div>
    {error && <p className="mt-1 text-xs text-red-500 flex items-center"><span className="mr-1">•</span> {error}</p>}
  </div>
);

const RadioCard = ({
  selected,
  value,
  onChange,
  title,
  icon: Icon,
  subtitle
}: {
  selected: string;
  value: string;
  onChange: (value: string) => void;
  title: string;
  icon: LucideIcon;
  subtitle?: string;
}) => (
  <div 
    onClick={() => onChange(value)}
    className={`
      cursor-pointer relative p-5 rounded-xl border-2 transition-all duration-200 ease-out
      hover:shadow-md flex items-center space-x-4
      ${selected === value 
        ? 'border-blue-600 bg-blue-50 shadow-inner' 
        : 'border-gray-200 bg-white hover:border-blue-300'
      }
    `}
  >
    <div className={`
      p-3 rounded-full flex-shrink-0 transition-colors
      ${selected === value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}
    `}>
      <Icon size={24} />
    </div>
    <div className="flex-1">
      <h3 className={`font-bold ${selected === value ? 'text-blue-900' : 'text-gray-800'}`}>{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    <div className={`
      w-6 h-6 rounded-full border-2 flex items-center justify-center
      ${selected === value ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}
    `}>
      {selected === value && <Check size={14} className="text-white" />}
    </div>
  </div>
);

export default function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    loanPurpose: '',
    propertyState: '',
    estimatedPrice: '',
    creditScore: '',
    employmentStatus: '',
    annualIncome: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'estimatedPrice') {
      const formatted = formatCurrency(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    if (currentStep === 1) { 
      if (!formData.loanPurpose) {
        newErrors.loanPurpose = 'Please select a loan purpose';
        isValid = false;
      }
    }
    if (currentStep === 2) { 
      const rawPrice = formData.estimatedPrice.replace(/\D/g, '');
      if (!rawPrice) {
        newErrors.estimatedPrice = 'Estimated price is required';
        isValid = false;
      }
      if (!formData.propertyState) {
        newErrors.propertyState = 'State is required';
        isValid = false;
      }
      if (!formData.creditScore) {
        newErrors.creditScore = 'Please select a credit score range';
        isValid = false;
      }
    }
    if (currentStep === 3) { 
      if (!formData.firstName) { newErrors.firstName = 'First name is required'; isValid = false; }
      if (!formData.lastName) { newErrors.lastName = 'Last name is required'; isValid = false; }
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) { 
        newErrors.email = 'Valid email is required'; 
        isValid = false; 
      }
      if (!formData.phone) { 
        newErrors.phone = 'Phone number is required'; 
        isValid = false; 
      } else if (formData.phone.length < 14) {
        newErrors.phone = 'Please enter a valid phone number';
        isValid = false;
      }
      if (!formData.password || formData.password.length < 8) { 
        newErrors.password = 'Password must be at least 8 characters'; 
        isValid = false; 
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (step === 0 || validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  // --- Step Content Renderers ---

  const renderWelcomeStep = () => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-2 shadow-sm border border-blue-100">
        <Home size={40} strokeWidth={1.5} />
      </div>
      
      <div className="space-y-4 max-w-lg">
        <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
          Ready to find your <span className="text-blue-600">dream home?</span>
        </h2>
        <p className="text-lg text-gray-500 leading-relaxed px-4">
          The first step is a pre-approval. Get yours in as little as 3 minutes without affecting your credit score.
        </p>
      </div>

      <div className="w-full max-w-sm pt-4 space-y-4">
        <button 
          onClick={nextStep}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center group text-lg"
        >
          Get Pre-Approved
          <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
        
        <div className="flex justify-center items-center space-x-6 pt-2">
          <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-widest">
            <Clock size={14} className="mr-1.5" /> 3 Min Setup
          </div>
          <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-widest">
            <MousePointerClick size={14} className="mr-1.5" /> No Credit Impact
          </div>
        </div>
      </div>
    </div>
  );

  const renderGoalStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Let's get started.</h2>
        <p className="text-gray-500 mt-2">What is your primary goal today?</p>
      </div>
      <div className="grid gap-4">
        <RadioCard 
          title="Buy a Home" 
          subtitle="Get pre-approved for a new purchase"
          icon={Home} 
          value="purchase" 
          selected={formData.loanPurpose} 
          onChange={(val) => setFormData({...formData, loanPurpose: val})} 
        />
        <RadioCard 
          title="Refinance" 
          subtitle="Lower rate or get cash out"
          icon={DollarSign} 
          value="refinance" 
          selected={formData.loanPurpose} 
          onChange={(val) => setFormData({...formData, loanPurpose: val})} 
        />
      </div>
      {errors.loanPurpose && <p className="text-red-500 text-sm text-center">{errors.loanPurpose}</p>}
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Property Details</h2>
        <p className="text-gray-500 mt-2">Tell us a bit about what you're looking for.</p>
      </div>
      <InputGroup label="Property State" icon={Building} error={errors.propertyState}>
        <select 
          name="propertyState" 
          value={formData.propertyState}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none text-gray-700"
        >
          <option value="">Select a State</option>
          <option value="AL">Alabama</option>
          <option value="CA">California</option>
          <option value="FL">Florida</option>
          <option value="NY">New York</option>
          <option value="TX">Texas</option>
          <option value="WA">Washington</option>
        </select>
      </InputGroup>
      <InputGroup label="Estimated Purchase Price" icon={DollarSign} error={errors.estimatedPrice}>
        <input 
          type="text"
          inputMode="numeric" 
          name="estimatedPrice"
          placeholder="e.g. 450,000"
          value={formData.estimatedPrice}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </InputGroup>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Estimated Credit Score</label>
        <div className="grid grid-cols-2 gap-3">
          {['720+', '680-719', '640-679', 'Below 640'].map((score) => (
            <button
              key={score}
              onClick={() => {
                setFormData(prev => ({ ...prev, creditScore: score }));
                if (errors.creditScore) setErrors(prev => ({ ...prev, creditScore: null }));
              }}
              className={`
                py-3 px-4 rounded-lg border text-sm font-medium transition-all
                ${formData.creditScore === score 
                  ? 'border-blue-600 bg-blue-50 text-blue-800' 
                  : 'border-gray-200 text-gray-600 hover:border-blue-300 bg-white'}
              `}
            >
              {score}
            </button>
          ))}
        </div>
        {errors.creditScore && <p className="mt-2 text-xs text-red-500">{errors.creditScore}</p>}
      </div>
    </div>
  );

  const renderAccountStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-500 mt-2">Save your progress and see your options.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputGroup label="First Name" icon={User} error={errors.firstName}>
          <input 
            type="text" 
            name="firstName" 
            placeholder="Jane"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </InputGroup>
        <InputGroup label="Last Name" icon={User} error={errors.lastName}>
          <input 
            type="text" 
            name="lastName" 
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </InputGroup>
      </div>
      <InputGroup label="Mobile Number" icon={Check} error={errors.phone}>
        <input 
          type="tel" 
          name="phone" 
          placeholder="(555) 123-4567"
          value={formData.phone}
          onChange={handleInputChange}
          maxLength={14}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
        />
      </InputGroup>
      <InputGroup label="Email Address" icon={Check} error={errors.email}>
        <input 
          type="email" 
          name="email" 
          placeholder="jane@example.com"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </InputGroup>
      <InputGroup label="Create Password" icon={Lock} error={errors.password}>
        <input 
          type="password" 
          name="password" 
          placeholder="Min 8 characters"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </InputGroup>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-10">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check size={40} strokeWidth={3} />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">You're All Set!</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Thanks, {formData.firstName}. We've received your information. A loan officer will review your details and contact you shortly with your pre-approval options.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-8 text-blue-600 font-medium hover:text-blue-800"
      >
        Start a new application
      </button>
    </div>
  );

  const steps = [
    { title: 'Welcome', render: renderWelcomeStep },
    { title: 'Goal', render: renderGoalStep },
    { title: 'Details', render: renderDetailsStep },
    { title: 'Account', render: renderAccountStep },
    { title: 'Finish', render: renderSuccessStep },
  ];

  const showNav = step > 0 && step < steps.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side - Values & Branding */}
        <div className="md:w-5/12 bg-blue-900 p-8 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center space-x-2 mb-10">
              <div className="bg-white p-2 rounded-lg text-blue-900">
                <Home size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight">eXp Realty</span>
            </div>

            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold mb-4 leading-tight">
                  Home ownership starts here.
                </h1>
                <p className="text-blue-100 text-sm leading-relaxed opacity-90">
                  Start your homebuying journey with confidence. Know exactly what you can afford before you start looking.
                </p>
              </div>

              {/* Specific Value Points Requested */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="mt-1 bg-blue-800/50 p-2 rounded-lg">
                    <Target size={20} className="text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Know your budget</h4>
                    <p className="text-blue-200 text-xs leading-relaxed mt-1">Understand your buying power and loan options instantly.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="mt-1 bg-blue-800/50 p-2 rounded-lg">
                    <User size={20} className="text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Show sellers you're qualified</h4>
                    <p className="text-blue-200 text-xs leading-relaxed mt-1">A pre-approval letter proves you are a serious, verified buyer.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="mt-1 bg-blue-800/50 p-2 rounded-lg">
                    <Zap size={20} className="text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Speed up the process</h4>
                    <p className="text-blue-200 text-xs leading-relaxed mt-1">Close faster once you find the right home with ready financing.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-10 space-y-4">
              <div className="flex items-center space-x-3 text-xs text-blue-200">
                <ShieldCheck className="text-green-400" size={18} />
                <span>Bank-level 256-bit encryption</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-blue-200">
                <Briefcase className="text-green-400" size={18} />
                <span>Trusted by 50,000+ homeowners</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-7/12 p-6 md:p-12 flex flex-col">
          {showNav && (
            <div className="mb-6 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Step {step} of {steps.length - 2}
              </span>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Pre-Approval
              </span>
            </div>
          )}

          {showNav && (
            <ProgressBar currentStep={step} totalSteps={steps.length - 2} />
          )}

          <div className="flex-1 flex flex-col justify-center">
            {steps[step].render()}
          </div>

          {showNav && (
            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
              <button 
                onClick={prevStep}
                className="flex items-center text-gray-500 hover:text-gray-800 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={18} className="mr-1" /> Back
              </button>
              
              <button 
                onClick={nextStep}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5"
              >
                {step === steps.length - 2 ? 'View Rates' : 'Continue'} 
                <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}