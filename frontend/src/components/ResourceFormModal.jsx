import { useEffect, useState } from 'react'
import { X, Save, PlusCircle, Upload, Eye } from 'lucide-react'
import { uploadResourceImage } from '../services/uploadService'

const TYPES = ['LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT']
const STATUSES = ['ACTIVE', 'OUT_OF_SERVICE']

const TYPE_TIME_RULES = {
  LECTURE_HALL: { from: '07:00', to: '20:00' },
  LAB: { from: '08:00', to: '18:00' },
  MEETING_ROOM: { from: '08:00', to: '17:00' },
  EQUIPMENT: { from: '06:00', to: '22:00' },
}

const GLOBAL_MIN_TIME = '06:00'
const GLOBAL_MAX_TIME = '22:00'
const MIN_DURATION_MINUTES = 30
const MAX_DURATION_MINUTES = 12 * 60

const defaultForm = {
  name: '',
  type: 'LECTURE_HALL',
  capacity: '',
  location: '',
  description: '',
  status: 'ACTIVE',
  imageUrl: '',
  availableFrom: '',
  availableTo: '',
}

const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export default function ResourceFormModal({
  open,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
  readOnly = false,
}) {
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState({})
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        type: initialData.type || 'LECTURE_HALL',
        capacity: initialData.capacity ?? '',
        location: initialData.location || '',
        description: initialData.description || '',
        status: initialData.status || 'ACTIVE',
        imageUrl: initialData.imageUrl || '',
        availableFrom: initialData.availableFrom || '',
        availableTo: initialData.availableTo || '',
      })
      setImagePreview(initialData.imageUrl || '')
    } else {
      setForm(defaultForm)
      setImagePreview('')
    }

    setImageFile(null)
    setErrors({})
    setUploadingImage(false)
  }, [initialData, open])

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  if (!open) return null

  const handleChange = (e) => {
    if (readOnly) return

    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))

    if (name === 'imageUrl' && !imageFile) {
      setImagePreview(value.trim())
    }
  }

  const handleFileChange = (e) => {
    if (readOnly) return

    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        imageFile: 'Only JPG, PNG, and WEBP images are allowed',
      }))
      return
    }

    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        imageFile: 'Image size must be less than 5MB',
      }))
      return
    }

    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }

    setImageFile(file)
    setErrors((prev) => ({
      ...prev,
      imageFile: '',
      imageUrl: '',
    }))

    setImagePreview(URL.createObjectURL(file))
  }

  const validateForm = () => {
    const newErrors = {}
    const trimmedName = form.name.trim()
    const trimmedLocation = form.location.trim()
    const trimmedImageUrl = form.imageUrl.trim()

    if (!trimmedName) {
      newErrors.name = 'Resource name is required'
    } else if (trimmedName.length < 3) {
      newErrors.name = 'Resource name must be at least 3 characters'
    }

    if (!trimmedLocation) {
      newErrors.location = 'Location is required'
    } else if (trimmedLocation.length < 2) {
      newErrors.location = 'Location must be at least 2 characters'
    }

    if (form.capacity === '') {
      newErrors.capacity = 'Capacity is required'
    } else if (Number.isNaN(Number(form.capacity))) {
      newErrors.capacity = 'Capacity must be a valid number'
    } else if (Number(form.capacity) <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0'
    }

    if (
      (form.availableFrom && !form.availableTo) ||
      (!form.availableFrom && form.availableTo)
    ) {
      newErrors.availableFrom = 'Please select both start and end time'
      newErrors.availableTo = 'Please select both start and end time'
    }

    if (form.availableFrom && form.availableTo) {
      const fromMinutes = toMinutes(form.availableFrom)
      const toMinutesValue = toMinutes(form.availableTo)
      const duration = toMinutesValue - fromMinutes

      if (form.availableFrom >= form.availableTo) {
        newErrors.availableTo = 'Available To must be later than Available From'
      } else {
        if (duration < MIN_DURATION_MINUTES) {
          newErrors.availableTo = 'Availability duration must be at least 30 minutes'
        }

        if (duration > MAX_DURATION_MINUTES) {
          newErrors.availableTo = 'Availability duration cannot exceed 12 hours'
        }

        if (
          form.availableFrom < GLOBAL_MIN_TIME ||
          form.availableTo > GLOBAL_MAX_TIME
        ) {
          newErrors.availableFrom = `Availability time must be between ${GLOBAL_MIN_TIME} and ${GLOBAL_MAX_TIME}`
          newErrors.availableTo = `Availability time must be between ${GLOBAL_MIN_TIME} and ${GLOBAL_MAX_TIME}`
        }

        const typeRule = TYPE_TIME_RULES[form.type]
        if (
          typeRule &&
          (form.availableFrom < typeRule.from || form.availableTo > typeRule.to)
        ) {
          newErrors.availableFrom = `${form.type.replaceAll('_', ' ')} must be available only between ${typeRule.from} and ${typeRule.to}`
          newErrors.availableTo = `${form.type.replaceAll('_', ' ')} must be available only between ${typeRule.from} and ${typeRule.to}`
        }
      }
    }

    if (!imageFile && trimmedImageUrl) {
      try {
        new URL(trimmedImageUrl)
      } catch {
        newErrors.imageUrl = 'Please enter a valid image URL'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (readOnly) return
    if (loading || uploadingImage) return
    if (!validateForm()) return

    try {
      let finalImageUrl = form.imageUrl.trim()

      if (imageFile) {
        setUploadingImage(true)
        finalImageUrl = await uploadResourceImage(imageFile)
      }

      await onSubmit({
        ...form,
        name: form.name.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        imageUrl: finalImageUrl,
        capacity: Number(form.capacity),
      })
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        imageFile: error?.message || 'Image upload failed',
      }))
    } finally {
      setUploadingImage(false)
    }
  }

  const inputStyle = {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
  }

  const disabledInputStyle = {
    ...inputStyle,
    opacity: 0.85,
    cursor: 'not-allowed',
  }

  const errorInputStyle = {
    ...inputStyle,
    border: '1px solid #f87171',
  }

  const errorTextStyle = {
    color: '#f87171',
    fontSize: '12px',
    marginTop: '6px',
  }

  const getFieldStyle = (fieldName) => {
    if (readOnly) return disabledInputStyle
    return errors[fieldName] ? errorInputStyle : inputStyle
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <div className="relative z-10 w-full max-w-2xl rounded-2xl glass-card bg-[rgba(255,255,255,0.98)] p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {readOnly
                  ? 'View Resource'
                  : initialData
                  ? 'Edit Resource'
                  : 'Create Resource'}
              </h2>
              <p
                className="text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                {readOnly
                  ? 'Resource details in view-only mode'
                  : 'Manage resource catalogue details'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={readOnly}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={getFieldStyle('name')}
                />
                {!readOnly && errors.name && <p style={errorTextStyle}>{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                  Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  disabled={readOnly}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={getFieldStyle('type')}
                >
                  {TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.replaceAll('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                  Capacity
                </label>
                <input
                  name="capacity"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={handleChange}
                  disabled={readOnly}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={getFieldStyle('capacity')}
                />
                {!readOnly && errors.capacity && <p style={errorTextStyle}>{errors.capacity}</p>}
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  disabled={readOnly}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={getFieldStyle('status')}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                  Location
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  disabled={readOnly}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={getFieldStyle('location')}
                />
                {!readOnly && errors.location && <p style={errorTextStyle}>{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                  Image URL
                </label>
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  disabled={readOnly}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={getFieldStyle('imageUrl')}
                  placeholder="https://example.com/image.jpg"
                />
                {!readOnly && errors.imageUrl && <p style={errorTextStyle}>{errors.imageUrl}</p>}
              </div>

              {!readOnly && (
                <div className="md:col-span-2">
                  <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                    Upload Image
                  </label>

                  <label
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer text-sm"
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px dashed var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <Upload size={16} />
                    <span>{imageFile ? imageFile.name : 'Choose image from device'}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {errors.imageFile && <p style={errorTextStyle}>{errors.imageFile}</p>}
                </div>
              )}

              {imagePreview && (
                <div className="md:col-span-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-56 object-cover rounded-xl"
                    onError={() => {
                      if (!imageFile) {
                        setErrors((prev) => ({
                          ...prev,
                          imageUrl: 'Unable to load image from the provided URL',
                        }))
                      }
                    }}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                  Available From
                </label>
                <input
                  name="availableFrom"
                  type="time"
                  value={form.availableFrom}
                  onChange={handleChange}
                  disabled={readOnly}
                  min={GLOBAL_MIN_TIME}
                  max={GLOBAL_MAX_TIME}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={getFieldStyle('availableFrom')}
                />
                {!readOnly && errors.availableFrom && (
                  <p style={errorTextStyle}>{errors.availableFrom}</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                  Available To
                </label>
                <input
                  name="availableTo"
                  type="time"
                  value={form.availableTo}
                  onChange={handleChange}
                  disabled={readOnly}
                  min={GLOBAL_MIN_TIME}
                  max={GLOBAL_MAX_TIME}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={getFieldStyle('availableTo')}
                />
                {!readOnly && errors.availableTo && (
                  <p style={errorTextStyle}>{errors.availableTo}</p>
                )}
              </div>

              {!readOnly && (
                <div className="md:col-span-2">
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Allowed general time range: {GLOBAL_MIN_TIME} to {GLOBAL_MAX_TIME}. Minimum duration: 30 minutes. Maximum duration: 12 hours.
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Type rules — Lecture Hall: 07:00–20:00, Lab: 08:00–18:00, Meeting Room: 08:00–17:00, Equipment: 06:00–22:00.
                  </p>
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  disabled={readOnly}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={getFieldStyle('description')}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid rgba(148,163,184,0.22)',
                }}
              >
                {readOnly ? 'Close' : 'Cancel'}
              </button>

              {!readOnly && (
                <button
                  type="submit"
                  disabled={loading || uploadingImage}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-white flex items-center gap-2 disabled:opacity-60"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--accent-start), var(--accent-end))',
                  }}
                >
                  {initialData ? <Save size={16} /> : <PlusCircle size={16} />}
                  {loading || uploadingImage
                    ? 'Saving...'
                    : initialData
                    ? 'Update'
                    : 'Create'}
                </button>
              )}

              {readOnly && (
                <div
                  className="px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
                  style={{
                    background: 'var(--status-approved-bg)',
                    color: 'var(--status-approved)',
                    border: '1px solid var(--status-approved-border)',
                  }}
                >
                  <Eye size={16} />
                  View Only
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}