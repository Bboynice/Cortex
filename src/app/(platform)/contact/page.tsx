import GlowButton from "@/src/components/ui/GlowButton/GlowButton";
export default function ContactPage() {
    return (
      <main className="w-full max-w-5xl px-6 py-16 bg-blue-500">
        <h1 className="text-3xl font-extrabold tracking-tight text-content font-bold">Do not hesitate to contact us!</h1>
        <p className="mt-3 text-muted-foreground font-medium">
          Please share your concerns or suggestions with us.
        </p>
        <form className="flex flex-col gap-4 border border-border rounded-lg p-4 bg-red-500">
          <input type="text" name="name" placeholder="Name" />
          <input type="email" name="email" placeholder="Email" />
          <textarea name="message" placeholder="Message" />
          <GlowButton effect="glow" roundness={8}>Submit</GlowButton>
        </form>
      </main>
    );
  }
  
  