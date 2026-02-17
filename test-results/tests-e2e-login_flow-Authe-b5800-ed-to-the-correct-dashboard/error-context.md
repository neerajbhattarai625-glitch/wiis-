# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - button "Back to Home" [ref=e4] [cursor=pointer]:
      - img
      - text: Back to Home
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img [ref=e8]
        - heading "citizen Login" [level=1] [ref=e11]
        - paragraph [ref=e12]: Welcome back! Please enter your details.
      - generic [ref=e13]:
        - generic [ref=e15]:
          - button "citizen" [ref=e16] [cursor=pointer]
          - button "collector" [ref=e17] [cursor=pointer]
          - button "admin" [ref=e18] [cursor=pointer]
        - generic [ref=e20]:
          - generic [ref=e21]:
            - text: Email
            - textbox "Email" [ref=e22]:
              - /placeholder: name@example.com
              - text: citizen@waste.com
          - generic [ref=e23]:
            - text: Password
            - textbox "Password" [ref=e24]: citizen123
          - generic [ref=e25]: Failed to fetch
          - button "Sign In" [ref=e26] [cursor=pointer]
        - generic [ref=e27]:
          - text: Don't have an account?
          - generic [ref=e28] [cursor=pointer]: Sign up
  - region "Notifications alt+T"
```