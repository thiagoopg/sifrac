import { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * AuditPage — interações com a página de auditoria (/solicitacoes/:id/audit).
 */
export class AuditPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Header e Navegação ─────────────────────────────────────────────────────

  /** Botão "Voltar" no header */
  voltarButton() {
    return this.page.locator('button').filter({ has: this.page.locator('[data-icon="arrow-left"]') }).first();
  }

  async clickVoltar() {
    await this.voltarButton().click();
  }

  /** Verifica se o título "Histórico de Auditoria" está presente */
  async expectTituloPresente() {
    await expect(this.page.getByRole('heading', { name: 'Histórico de Auditoria', level: 1 })).toBeVisible();
  }

  // ── Info da Solicitação ──────────────────────────────────────────────────────

  /** Verifica se a seção de info da solicitação está visível */
  async expectSolicitacaoInfoVisible() {
    await expect(this.page.locator('.bg-white.rounded-xl.border').filter({ hasText: 'Aluno:' })).toBeVisible();
  }

  /** Verifica se um campo de info específico aparece */
  async expectSolicitacaoField(label: string, value?: string) {
    await expect(this.page.getByText(label, { exact: false })).toBeVisible();
    if (value) {
      await expect(this.page.getByText(value)).toBeVisible();
    }
  }

  // ── Timeline de Eventos ──────────────────────────────────────────────────────

  /** Verifica se a seção de timeline está presente */
  async expectTimelineVisible() {
    await expect(this.page.getByRole('heading', { name: 'Timeline de Eventos', level: 2 })).toBeVisible();
  }

  /** Verifica se há pelo menos um log de auditoria na timeline */
  async expectLogPresente() {
    // Cada log tem ícone circular + label de ação
    await expect(this.page.locator('div.rounded-full.flex.items-center.justify-center').first()).toBeVisible();
  }

  /** Verifica se há exatamente N logs */
  async contarLogs() {
    return this.page.locator('div.px-6.py-4.flex.gap-4').count();
  }

  /** Verifica se a primeira entrada da timeline (log) está visível */
  async expectEntradaTimelineVisivel() {
    await expect(this.page.locator('div.px-6.py-4.flex.gap-4').first()).toBeVisible();
  }

  /** Verifica se há mensagem de estado vazio */
  async expectVazio() {
    await expect(this.page.getByText('Nenhum registro de auditoria encontrado')).toBeVisible();
  }

  /** Verifica se há loading (spinner) */
  async expectLoading() {
    await expect(this.page.locator('.animate-spin')).toBeVisible();
  }

  /** Verifica se há mensagem de erro */
  async expectErro() {
    await expect(this.page.locator('.text-red-600.text-sm')).toBeVisible();
  }

  /** Verifica ícone e cor corretos para um tipo de ação */
  async expectAcaoIconeCorreto(acaoLabel: string, esperadoIcone: string, classeEsperada: string) {
    // Encontra o log pela label da ação e verifica o ícone SVG e a classe
    const log = this.page.locator('div.px-6.py-4.flex.gap-4').filter({ hasText: acaoLabel }).first();
    await expect(log).toBeVisible();

    // Verifica ícone via data-testid (lucide-vue-next renderiza com data-icon nos SVGs)
    const iconContainer = log.locator('div.rounded-full.flex.items-center.justify-center').first();
    await expect(iconContainer).toHaveClass(classeEsperada);
  }

  /** Verifica transição de status em um log */
  async expectTransicaoStatusPresente(logIndex = 0) {
    const logs = this.page.locator('div.px-6.py-4.flex.gap-4');
    const log = logs.nth(logIndex);
    // Verifica presença de elemento com line-through (status anterior)
    await expect(log.locator('span.line-through')).toBeVisible();
  }

  /** Verifica se o status anterior (texto riscado) está visível na timeline */
  async expectStatusAnteriorVisivel() {
    await expect(this.page.locator('span.line-through').first()).toBeVisible();
  }

  /** Verifica se o novo status está visível na timeline */
  async expectNovoStatusVisivel() {
    await expect(this.page.locator('div.px-6.py-4.flex.gap-4 .font-medium.text-gray-900').first()).toBeVisible();
  }

  /** Verifica se o usuário responsável pela alteração está visível na timeline */
  async expectUsuarioResponsavelVisivel() {
    await expect(this.page.locator('div.px-6.py-4.flex.gap-4 .text-sm.text-gray-600').first()).toBeVisible();
  }

  /** Verifica se uma ação (Criação/Avaliação/Cancelamento) foi registrada na timeline */
  async expectAcaoRegistrada(acaoLabel: string) {
    await expect(this.page.getByText(acaoLabel).first()).toBeVisible();
  }

  /** Clica no botão "Tentar novamente" em caso de erro */
  async clickTentarNovamente() {
    await this.page.getByRole('button', { name: 'Tentar novamente' }).click();
  }

  // ── Seletores genéricos ──────────────────────────────────────────────────────

  /** Retorna todos os labels de ação na timeline */
  async obterLabelsAcao() {
    return this.page.locator('div.px-6.py-4.flex.gap-4 .font-medium.text-gray-900').allTextContents();
  }

  /** Retorna todos os nomes de usuário nos logs */
  async obterUsuariosLogs() {
    return this.page.locator('div.px-6.py-4.flex.gap-4 .text-sm.text-gray-600').allTextContents();
  }
}
