import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function Admin() {
  const [sifre, setSifre] = useState('')
  const [girisYapildi, setGirisYapildi] = useState(false)
  const [oyuncular, setOyuncular] = useState([])

  // GİRİŞ ŞİFRESİ BURADA (Değiştirebilirsin)
  const DOGRU_SIFRE = "qwex123^Q31d"

  function sifreKontrol() {
    if (sifre === DOGRU_SIFRE) {
      setGirisYapildi(true)
      verileriGetir()
    } else {
      alert("Hatalı Şifre!")
    }
  }

  async function verileriGetir() {
    const { data, error } = await supabase
      .from('oyuncular')
      .select('*')
      .order('kayit_tarihi', { ascending: false }) // En yeni en üstte
    
    if (!error) setOyuncular(data)
  }

  // Eğer giriş yapılmadıysa sadece şifre ekranı göster
  if (!girisYapildi) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
        <h2>🔒 Yönetici Girişi</h2>
        <input 
          type="password" 
          placeholder="Şifreyi giriniz" 
          value={sifre} 
          onChange={(e) => setSifre(e.target.value)}
          style={{ padding: '10px', fontSize: '18px', margin: '10px' }}
        />
        <button onClick={sifreKontrol} style={{ padding: '10px 20px', fontSize: '18px', cursor: 'pointer' }}>Giriş Yap</button>
        <br />
        <a href="/">Ana Sayfaya Dön</a>
      </div>
    )
  }

  // Giriş yapıldıysa listeyi göster
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1>📋 Oyuncu Hareketleri</h1>
        <button onClick={() => window.location.href='/'} style={{padding: '5px 10px'}}>Çıkış Yap</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead style={{ backgroundColor: '#333', color: 'white' }}>
          <tr>
            <th style={{ padding: '10px' }}>Tarih</th>
            <th style={{ padding: '10px' }}>Kullanıcı</th>
            <th style={{ padding: '10px' }}>Mermi</th>
            <th style={{ padding: '10px' }}>Koruma</th>
          </tr>
        </thead>
        <tbody>
          {oyuncular.map((oyuncu) => (
            <tr key={oyuncu.id} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
              <td style={{ padding: '10px' }}>
                {new Date(oyuncu.kayit_tarihi).toLocaleString('tr-TR')}
              </td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{oyuncu.kullanici_adi}</td>
              <td style={{ padding: '10px' }}>{oyuncu.mermi_sayisi}</td>
              <td style={{ padding: '10px' }}>{oyuncu.koruma_sayisi}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}