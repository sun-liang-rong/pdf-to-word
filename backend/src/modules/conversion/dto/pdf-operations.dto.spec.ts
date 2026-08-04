import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ExtractPagesDto } from './extract-pages.dto';
import { RotatePdfDto } from './rotate-pdf.dto';
import { TextWatermarkDto } from './text-watermark.dto';

async function errorsFor<T extends object>(type: new () => T, input: object) {
  return validate(plainToInstance(type, input));
}

describe('PDF operation DTOs', () => {
  it.each(['90', '180', '270'])('accepts rotate angle %s from multipart data', async (angle) => {
    expect(await errorsFor(RotatePdfDto, { angle })).toHaveLength(0);
  });

  it.each(['0', '45', '360', 'invalid', ''])('rejects rotate angle %s', async (angle) => {
    expect(await errorsFor(RotatePdfDto, { angle })).not.toHaveLength(0);
  });

  it.each(['1', '1,3-5,8', '10-12'])('accepts page expression %s', async (pageNumbers) => {
    expect(await errorsFor(ExtractPagesDto, { pageNumbers })).toHaveLength(0);
  });

  it.each(['', '0', '1,', '3-1', '1,,2', 'all', '2n'])('rejects page expression %s', async (pageNumbers) => {
    expect(await errorsFor(ExtractPagesDto, { pageNumbers })).not.toHaveLength(0);
  });

  it('transforms and validates text watermark multipart fields', async () => {
    const input = plainToInstance(TextWatermarkDto, {
      text: 'CONFIDENTIAL', fontSize: '30', rotation: '-45', opacity: '0.35',
      spacing: '50', customColor: '#d3d3d3',
    });
    expect(await validate(input)).toHaveLength(0);
    expect(input).toMatchObject({ fontSize: 30, rotation: -45, opacity: 0.35, spacing: 50 });
  });

  it.each([
    { text: '' }, { fontSize: '0' }, { rotation: '361' }, { opacity: '1.1' },
    { spacing: '-1' }, { customColor: 'red' },
  ])('rejects invalid watermark values %#', async (override) => {
    const valid = { text: 'mark', fontSize: '30', rotation: '0', opacity: '0.5', spacing: '50', customColor: '#abcdef' };
    expect(await errorsFor(TextWatermarkDto, { ...valid, ...override })).not.toHaveLength(0);
  });
});
