import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Number", test: (p: string) => /[0-9]/.test(p) },
  { label: "Symbol (!@#$…)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

type Form = { currentPassword: string; newPassword: string };

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  form: Form;
  onChange: (f: Form) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string;
  loading: boolean;
}

export function ChangePasswordDialog({ open, onOpenChange, form, onChange, onSubmit, error, loading }: Props) {
  const allRulesPassed = PASSWORD_RULES.every(({ test }) => test(form.newPassword));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
        <form id="pw-form" onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="currentPassword">Current Password</Label>
            <PasswordInput id="currentPassword" value={form.currentPassword} onChange={(e) => onChange({ ...form, currentPassword: e.target.value })} required autoComplete="current-password" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="newPassword">New Password</Label>
            <PasswordInput id="newPassword" value={form.newPassword} onChange={(e) => onChange({ ...form, newPassword: e.target.value })} required autoComplete="new-password" />
            {form.newPassword && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PASSWORD_RULES.map(({ label, test }) => (
                  <Badge key={label} variant={test(form.newPassword) ? "default" : "outline"} className="text-xs">
                    {test(form.newPassword) ? "✓" : "✗"} {label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="pw-form" disabled={loading || !allRulesPassed}>{loading ? "Saving..." : "Change Password"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
