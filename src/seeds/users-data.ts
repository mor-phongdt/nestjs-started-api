export const language = [
  {
    id: 1,
    name: 'Javascript',
    imageUrl: '',
  },
  {
    id: 2,
    name: 'Typescript',
    imageUrl: '',
  },
  {
    id: 3,
    name: 'Html',
    imageUrl: '',
  },
  {
    id: 4,
    name: 'Css',
    imageUrl: '',
  },
  {
    id: 5,
    name: 'ReactJS',
    imageUrl: '',
  },
  {
    id: 6,
    name: 'VueJs',
    imageUrl: '',
  },
];

export const sampleMarkdown = `
An h1 header
============

Paragraphs are separated by a blank line.

2nd paragraph. *Italic*, **bold**, and \`monospace\`. Itemized lists
look like:

  * this one
  * that one
  * the other one

Note that --- not considering the asterisk --- the actual text
content starts at 4-columns in.

> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.

Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., "it's all
in chapters 12--14"). Three dots ... will be converted to an ellipsis.
Unicode is supported. ☺

...

And the rest of your Markdown content.
`;

export const codeSample = {
  '/Wrapper.js': `export default () => "";`,
  '/Button.js': `export default () => {
    return <button>Hello</button>
    };`,
};
