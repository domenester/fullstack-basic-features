export const formatBody = (body: any) =>
  JSON.stringify(body)
    .replace(/\"([^(\")"]+)\":/g, '$1:')
    .replace(/\";;/g, '')
    .replace(/;;\"/g, '');

export const buildMutation = (
  name: string,
  body: any,
  data: string[],
  withMessage = false,
) => {
  return `
    mutation {
      ${name}(body: ${formatBody(body)}) {
        data {
          ${data.join(' ')}
        }
        ${withMessage ? 'message' : ''}
      }
    }`;
};

export const buildQuery = (
  name: string,
  body: any,
  data: string[],
  withMessage = false,
) => {
  return `
    query {
      ${name}(body: ${formatBody(body)}) {
        data {
          ${data.join(' ')}
        }
        ${withMessage ? 'message' : ''}
      }
    }`;
};
