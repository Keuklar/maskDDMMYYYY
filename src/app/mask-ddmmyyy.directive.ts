import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appMaskDDMMYYY]'
})
export class MaskDDMMYYYDirective {

  constructor(private el: ElementRef) { }


  static computeNewState(oldString: string, oldPosition: number, char: string): { string: string, position: number } {
    const digits = '0123456789';
    const slash = '/';
    const ddmmyyyy = 'dd/mm/yyyy';
    const digitsOrSlash = digits + slash;
    const isDigitsOrSlash = digitsOrSlash.includes(char);
    const onlySlash = [2, 5];
    const onlyDigits = [0, 3, 6, 7, 8, 9];
    const isDigit = digits.includes(char);
    const isSlash = slash.includes(char);
    const charTyped = char !== undefined && char.length > 0;
    const zeroRestriction = (position: number) => (oldString.charAt(position - 1) === '0' || oldString.charAt(position + 1) === '0')
      && position < 7;
    const dayRestriction = oldPosition === 0 && digits.includes(oldString.charAt(1)) && +char > 3;
    const monthRestriction = oldPosition === 3 && digits.includes(oldString.charAt(4)) && +char > 1;
    const zeroRestrictions = isDigit && char === '0' && (oldPosition === 6 || zeroRestriction(oldPosition));
    let result = ({ string: oldString, position: oldPosition });
    if (charTyped && isDigitsOrSlash
      && !((isSlash && onlyDigits.includes(oldPosition)) || isDigit && (onlySlash.includes(oldPosition)))
      && !(zeroRestrictions)
      && !(dayRestriction)
      && !(monthRestriction)
      && (oldString.length < ddmmyyyy.length
        || oldString.length === ddmmyyyy.length && oldPosition < ddmmyyyy.length)
    ) {
      if (oldPosition < oldString.length &&
        (oldString.length === ddmmyyyy.length
          || oldPosition <= 1 && !oldString.substring(0, 2).includes(slash) && (oldString.length >= 2)
          || (oldPosition >= 3 && oldPosition <= 4) && !oldString.substring(3, 5).includes(slash) && (oldString.length >= 5)
        )) {
        const replaceAt = (chaine: string, c: string, position: number) =>
          chaine.slice(0, position) + c + chaine.slice(position + 1, chaine.length);
        result = { string: replaceAt(oldString, char, oldPosition), position: oldPosition + 1 };
      } else {
        const slashAndDigitAllowed = !onlySlash.includes(oldPosition) && !onlyDigits.includes(oldPosition);
        let offset = { string: char, position: 1 };
        if (isDigit && slashAndDigitAllowed) {
          offset = { string: char + '/', position: 2 };
        }
        const insertAt = (chaine: string, c: string, position: number) =>
          chaine.slice(0, position) + c + chaine.slice(position, chaine.length);
        if (isSlash && slashAndDigitAllowed) {
          result = { ...result, string: insertAt(result.string, '0', oldPosition - 1) };
          offset = { string: char, position: 2 };
        }
        result = { string: result.string + offset.string, position: result.position + offset.position };
        if (isDigit && onlyDigits.includes(oldPosition) && oldPosition < oldString.length) {
          offset = [1, 4].includes(oldString.length) ? { string: '/', position: 0 } : { string: '', position: 0 };
          result = { string: insertAt(oldString, char, oldPosition) + offset.string, position: oldPosition + 1 + offset.position };
        }
      }
    }
    return result;
  }

  @HostListener('keydown', ['$event.target', '$event'])
  onKeyDown(input, event) {
    // console.log('$event ', event);
    // console.log('keydown ', event.key);
    const positionDepart = event.target.selectionStart;
    // console.log('event.target.selectionStart', positionDepart);
    const oldValue = input.value;
    if (!['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(event.key)) {
      if (input.value === undefined || input.value.length <= 'dd/mm/yyyy'.length) {
        const newState = MaskDDMMYYYDirective.computeNewState(input.value, positionDepart, event.key);
        input.value = newState.string;
        input.setSelectionRange(newState.position, newState.position);
      }
    }
    if (!['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(event.key)) {
      event.preventDefault();
    }
    if (oldValue !== input.value) {
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));
    }
  }




}
