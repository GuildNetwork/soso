import { LitElement, TemplateResult, CSSResult } from 'lit-element';
export declare class SosoItem extends LitElement {
    value: string;
    name: string;
    selected: boolean;
    static readonly styles: CSSResult;
    render(): TemplateResult;
}