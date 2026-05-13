"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ClientMessage } from "@/lib/types";
import { Copy, Send, PencilLine, Check } from "lucide-react";
import { useState } from "react";

export function ClientMessageCard({ message }: { message: ClientMessage }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(`${message.subject}\n\n${message.body}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <Card>
      <CardHeader
        title="Mensaje sugerido al cliente"
        description={`Borrador en ${message.language === "en" ? "inglés" : "español"} — listo para revisión y envío`}
        action={
          <div className="flex items-center gap-1.5">
            <Button size="sm" variant="ghost"><PencilLine size={12} /> Editar</Button>
            <Button size="sm" variant="secondary" onClick={copy}>
              {copied ? <><Check size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
            </Button>
            <Button size="sm" variant="primary"><Send size={12} /> Enviar</Button>
          </div>
        }
      />
      <div className="px-4 py-3.5">
        <div className="text-[11px] uppercase tracking-wide text-text-tertiary mb-1">Asunto</div>
        <div className="text-sm font-medium text-text mb-3">{message.subject}</div>

        <div className="text-[11px] uppercase tracking-wide text-text-tertiary mb-1">Cuerpo</div>
        <pre className="whitespace-pre-wrap break-words text-sm text-text-secondary leading-relaxed font-sans bg-[color:var(--bg-muted)]/50 rounded-md border border-[color:var(--border)] px-3 py-3">
{message.body}
        </pre>
      </div>
    </Card>
  );
}
