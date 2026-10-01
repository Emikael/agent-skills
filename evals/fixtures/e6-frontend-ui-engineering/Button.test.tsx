import { createRef } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { Button } from './Button';

afterEach(cleanup);

test('disabled public button cannot invoke its action', () => {
  const action = vi.fn();
  render(<Button disabled onClick={action}>Save</Button>);
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(action).not.toHaveBeenCalled();
});

test('public button exposes its DOM ref for focus management', () => {
  const ref = createRef<HTMLButtonElement>();
  render(<Button ref={ref}>Open</Button>);
  ref.current?.focus();
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open' }));
});
