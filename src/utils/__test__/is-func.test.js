import { isFunc } from '../is-func';

test('should check correctly', () => {
    expect(isFunc(() => {})).toBeTruthy();
    expect(isFunc(class A {})).toBeTruthy();
    expect(isFunc(function*() {})).toBeTruthy();
    expect(isFunc(/a/)).toBeFalsy();
});
