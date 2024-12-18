export default function ContactMap() {
  return (
    <section className="h-[400px] w-full">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14902.931146364446!2d-109.4334089!3d-27.1505337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9947f017a8d4ae2b%3A0xbbe5b3edc02a2db6!2sHanga%20Roa%2C%20Isla%20de%20Pascua%2C%20Valpara%C3%ADso%2C%20Chile!5e0!3m2!1ses!2s!4v1628900000000!5m2!1ses!2s"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Ubicación de Hotumatur"
      />
    </section>
  )
}

