-- Trigger ISR para tabla tenants
-- Cuando se actualiza el tenant (credenciales MP, Resend, WhatsApp, etc.)
-- se invalida el cache del servidor automáticamente.

CREATE OR REPLACE FUNCTION public.trigger_isr_tenants()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM public.isr_notify(COALESCE(NEW.id, OLD.id), 'tenants');
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS isr_tenants ON public.tenants;
CREATE TRIGGER isr_tenants
  AFTER INSERT OR UPDATE OR DELETE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.trigger_isr_tenants();
