import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LogoutButton from '../LogoutButton'
import { BrowserRouter } from 'react-router-dom'

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

describe('LogoutButton', () => {
    it('clears localStorage and navigates to home on click', () => {
        // Set some auth data
        localStorage.setItem('token', 'fake-token')
        localStorage.setItem('isAuthenticated', 'true')

        render(
            <BrowserRouter>
                <LogoutButton />
            </BrowserRouter>
        )

        const logoutBtn = screen.getByText(/logout/i)
        fireEvent.click(logoutBtn)

        expect(localStorage.getItem('token')).toBeNull()
        expect(localStorage.getItem('isAuthenticated')).toBeNull()
        expect(mockNavigate).toHaveBeenCalledWith('/')
    })
})
