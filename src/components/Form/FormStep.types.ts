import { ReactNode } from 'react';

export interface FormStepProps {
  /**
   * Step title
   */
  title: string;

  /**
   * Step description (optional)
   */
  description?: string;

  /**
   * Step content
   */
  children: ReactNode;
}
