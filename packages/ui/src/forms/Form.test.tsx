import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { z } from 'zod';
import { createFormConfig, f, type FormContent } from '@itqa/core/forms';
import { Form } from './Form';

const schema = z.object({
  firstName: f(z.string().min(1, 'Name is required'), { type: 'text', order: 10 }),
  email: f(z.string().email('Enter a valid email'), { type: 'email', order: 20 }),
  consent: f(
    z.literal(true, {
      errorMap: () => ({ message: 'Consent is required' }),
    }),
    { type: 'checkbox', order: 30, colSpan: 2 },
  ),
});

const content: FormContent = {
  title: 'Example',
  submitLabel: 'Send',
  fields: {
    firstName: { label: 'First name', placeholder: 'Enter your name', help: 'As it appears on your ID.' },
    email: { label: 'Email' },
    consent: { label: 'I agree to the terms.' },
  },
  messages: {
    successTitle: 'Thanks',
    successBody: 'Received.',
    referenceLabel: 'Reference',
    duplicate: 'Duplicate',
    rateLimited: 'Slow down',
    validationError: 'Check the form',
    networkError: 'Network error',
    submitting: 'Submitting...',
    required: 'Required',
  },
};

const config = createFormConfig(schema, content);

describe('Form', () => {
  it('links labels, help text and required state', () => {
    render(<Form schema={schema} config={config} onSubmit={vi.fn()} />);

    const firstName = screen.getByLabelText(/first name/i);
    expect(firstName).toHaveAttribute('placeholder', 'Enter your name');
    expect(firstName.getAttribute('aria-describedby')).toContain('-help');
    expect(screen.getByText('As it appears on your ID.')).toBeInTheDocument();
  });

  it('shows validation errors and marks fields invalid', async () => {
    const user = userEvent.setup();
    render(<Form schema={schema} config={config} onSubmit={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    const firstName = screen.getByLabelText(/first name/i);
    expect(firstName).toHaveAttribute('aria-invalid', 'true');
    expect(firstName.getAttribute('aria-describedby')).toContain('-error');
  });

  it('reports changes to the watched field', async () => {
    const user = userEvent.setup();
    const onWatchChange = vi.fn();
    render(
      <Form
        schema={schema}
        config={config}
        onSubmit={vi.fn()}
        watchField="firstName"
        onWatchChange={onWatchChange}
      />,
    );

    await user.type(screen.getByLabelText(/first name/i), 'A');

    await waitFor(() => expect(onWatchChange).toHaveBeenLastCalledWith('A'));
  });

  it('submits valid values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Form schema={schema} config={config} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/first name/i), 'Ayesha');
    await user.type(screen.getByLabelText(/email/i), 'ayesha@example.com');
    await user.click(screen.getByLabelText(/i agree/i));
    await user.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        firstName: 'Ayesha',
        email: 'ayesha@example.com',
        consent: true,
      }),
    );
  });
});
